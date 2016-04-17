#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var et = require('elementtree');
var plist = require('plist');

var rootdir = process.argv[2];

var platformConfig = (function () {
    /*  Global object that defines the available custom preferences for each platform.
     Maps a config.xml preference to a specific target file, parent element, and destination attribute or element
     */
    var preferenceMappingData = {
        'android': {
            'android-manifest-hardwareAccelerated': {
                target: 'AndroidManifest.xml',
                parent: './',
                destination: 'android:hardwareAccelerated'
            },
            'android-installLocation': {
                target: 'AndroidManifest.xml',
                parent: './',
                destination: 'android:installLocation'
            },
            'android-activity-hardwareAccelerated': {
                target: 'AndroidManifest.xml',
                parent: 'application',
                destination: 'android:hardwareAccelerated'
            },
            'android-configChanges': {
                target: 'AndroidManifest.xml',
                parent: 'application/activity[@android:name=\'MainActivity\']',
                destination: 'android:configChanges'
            },
            'android-launchMode': {
                target: 'AndroidManifest.xml',
                parent: 'application/activity[@android:name=\'MainActivity\']',
                destination: 'android:launchMode'
            },
            'android-theme': {
                target: 'AndroidManifest.xml',
                parent: 'application/activity[@android:name=\'MainActivity\']',
                destination: 'android:theme'
            },
            'android-windowSoftInputMode': {
                target: 'AndroidManifest.xml',
                parent: 'application/activity[@android:name=\'MainActivity\']',
                destination: 'android:windowSoftInputMode'
            }
        },
        'ios': {}
    };

    /*  Global object that defines tags that should be added and not replaced
     */
    var multipleTags = {
        'android': ['intent-filter'],
        'ios': []
    };

    var configXmlData, preferencesData;

    return {
        // Parses a given file into an elementtree object
        parseElementtreeSync: function (filename) {
            var contents = fs.readFileSync(filename, 'utf-8');
            if (contents) {
                //Windows is the BOM. Skip the Byte Order Mark.
                contents = contents.substring(contents.indexOf('<'));
            }
            return new et.ElementTree(et.XML(contents));
        },

        // Converts an elementtree object to an xml string.  Since this is used for plist values, we don't care about attributes
        eltreeToXmlString: function (data) {
            var tag = data.tag;
            var el = '<' + tag + '>';

            if (data.text && data.text.trim()) {
                el += data.text.trim();
            } else {
                _.each(data.getchildren(), function (child) {
                    el += platformConfig.eltreeToXmlString(child);
                });
            }

            el += '</' + tag + '>';
            return el;
        },

        // Parses the config.xml into an elementtree object and stores in the config object
        getConfigXml: function () {
            if (!configXmlData) {
                configXmlData = this.parseElementtreeSync(path.join(rootdir, 'config.xml'));
            }

            return configXmlData;
        },

        /* Retrieves all <preferences ..> from config.xml and returns a map of preferences with platform as the key.
         If a platform is supplied, common prefs + platform prefs will be returned, otherwise just common prefs are returned.
         */
        getPreferences: function (platform) {
            var configXml = this.getConfigXml();

            //init common config.xml prefs if we haven't already
            if (!preferencesData) {
                preferencesData = {
                    common: configXml.findall('preference')
                };
            }

            var prefs = preferencesData.common || [];
            if (platform) {
                if (!preferencesData[platform]) {
                    preferencesData[platform] = configXml.findall('platform[@name=\'' + platform + '\']/preference');
                }
                prefs = prefs.concat(preferencesData[platform]);
            }

            return prefs;
        },

        /* Retrieves all configured xml for a specific platform/target/parent element nested inside a platforms config-file
         element within the config.xml.  The config-file elements are then indexed by target|parent so if there are
         any config-file elements per platform that have the same target and parent, the last config-file element is used.
         */
        getConfigFilesByTargetAndParent: function (platform) {
            var configFileData = this.getConfigXml().findall('platform[@name=\'' + platform + '\']/config-file');

            return _.indexBy(configFileData, function (item) {
                var parent = item.attrib.parent;
                //if parent attribute is undefined /* or */, set parent to top level elementree selector
                if (!parent || parent === '/*' || parent === '*/') {
                    parent = './';
                }
                return item.attrib.target + '|' + parent;
            });
        },

        /**
         * Check if a tag can be used multiple times in config
         */
        isMultipleTag: function (platform, tag) {
            var platformMultipleTags = multipleTags[platform];
            if (platformMultipleTags) {
                var isInArray = (platformMultipleTags.indexOf(tag) >= 0);
                return isInArray;
            } else {
                return false;
            }
        },

        // Parses the config.xml's preferences and config-file elements for a given platform
        parseConfigXml: function (platform) {
            var configData = {};
            this.parsePreferences(configData, platform);
            this.parseConfigFiles(configData, platform);

            return configData;
        },

        // Retrieves th e config.xml's pereferences for a given platform and parses them into JSON data
        parsePreferences: function (configData, platform) {
            var preferences = this.getPreferences(platform),
                type = 'preference';

            _.each(preferences, function (preference) {
                var prefMappingData = preferenceMappingData[platform][preference.attrib.name],
                    target,
                    prefData;

                if (prefMappingData) {
                    prefData = {
                        parent: prefMappingData.parent,
                        type: type,
                        destination: prefMappingData.destination,
                        data: preference
                    };

                    target = prefMappingData.target;
                    if (!configData[target]) {
                        configData[target] = [];
                    }
                    configData[target].push(prefData);
                }
            });
        },

        // Retrieves the config.xml's config-file elements for a given platform and parses them into JSON data
        parseConfigFiles: function (configData, platform) {
            var configFiles = this.getConfigFilesByTargetAndParent(platform),
                type = 'configFile';

            _.each(configFiles, function (configFile, key) {
                var keyParts = key.split('|');
                var target = keyParts[0];
                var parent = keyParts[1];
                var items = configData[target] || [];

                _.each(configFile.getchildren(), function (element) {
                    items.push({
                        parent: parent,
                        type: type,
                        destination: element.tag,
                        data: element
                    });
                });

                configData[target] = items;
            });
        },

        // Parses config.xml data, and update each target file for a specified platform
        updatePlatformConfig: function (platform) {
            var configData = this.parseConfigXml(platform),
                platformPath = path.join(rootdir, 'platforms', platform);

            _.each(configData, function (configItems, targetFileName) {
                var projectName, targetFile;

                if (platform === 'ios' && targetFileName.indexOf("Info.plist") > -1) {
                    projectName = platformConfig.getConfigXml().findtext('name');
                    targetFile = path.join(platformPath, projectName, projectName + '-Info.plist');
                    platformConfig.updateIosPlist(targetFile, configItems);
                } else if (platform === 'android' && targetFileName === 'AndroidManifest.xml') {
                    targetFile = path.join(platformPath, targetFileName);
                    platformConfig.updateAndroidManifest(targetFile, configItems);
                }
            });
        },

        // Updates the AndroidManifest.xml target file with data from config.xml
        updateAndroidManifest: function (targetFile, configItems) {
            var tempManifest = platformConfig.parseElementtreeSync(targetFile),
                root = tempManifest.getroot();

            _.each(configItems, function (item) {
                // if parent is not found on the root, child/grandchild nodes are searched
                var parentEl = root.find(item.parent) || root.find('*/' + item.parent),
                    data = item.data,
                    childSelector = item.destination,
                    childEl;

                if (!parentEl) {
                    return;
                }

                if (item.type === 'preference') {
                    parentEl.attrib[childSelector] = data.attrib['value'];
                } else {
                    // since there can be multiple uses-permission elements, we need to select them by unique name
                    if (childSelector === 'uses-permission') {
                        childSelector += '[@android:name=\'' + data.attrib['android:name'] + '\']';
                    }

                    childEl = parentEl.find(childSelector);

                    // if child element doesnt exist, create new element

                    var isMultipleTag = platformConfig.isMultipleTag('android', childSelector);
                    if (!childEl || isMultipleTag) {
                        childEl = new et.Element(item.destination);
                        parentEl.append(childEl);
                    }

                    // copy all config.xml data except for the generated _id property
                    _.each(data, function (prop, propName) {
                        if (propName !== '_id') {
                            childEl[propName] = prop;
                        }
                    });
                }
            });

            fs.writeFileSync(targetFile, tempManifest.write({indent: 4}), 'utf-8');
        },

        /* Updates the *-Info.plist file with data from config.xml by parsing to an xml string, then using the plist
         module to convert the data to a map.  The config.xml data is then replaced or appended to the original plist file
         */
        updateIosPlist: function (targetFile, configItems) {
            var infoPlist = plist.parse(fs.readFileSync(targetFile, 'utf-8')),
                tempInfoPlist;

            _.each(configItems, function (item) {
                var key = item.parent;
                var plistXml = '<plist><dict><key>' + key + '</key>';
                plistXml += platformConfig.eltreeToXmlString(item.data) + '</dict></plist>';

                var configPlistObj = plist.parse(plistXml);
                infoPlist[key] = configPlistObj[key];
            });

            tempInfoPlist = plist.build(infoPlist);
            tempInfoPlist = tempInfoPlist.replace(/<string>[\s\r\n]*<\/string>/g, '<string></string>');
            fs.writeFileSync(targetFile, tempInfoPlist, 'utf-8');
        }
    };
})();

// Main
(function () {
    if (rootdir) {

        var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);

        _.each(platforms, function (platform) {
            try {
                platform = platform.trim().toLowerCase();
                platformConfig.updatePlatformConfig(platform);
            } catch (e) {
                process.stdout.write(e);
            }
        });
    }
})();