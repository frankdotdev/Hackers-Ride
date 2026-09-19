const fs = require('fs');
const path = require('path');
const { withDangerousMod, withGradleProperties } = require('@expo/config-plugins');

function withSqliteAmalgamation(config) {
  // 1. Configure gradle.properties for IPv4, memory, and Prefab compatibility
  config = withGradleProperties(config, (config) => {
    // Force IPv4 so Gradle can reach sqlite.org if local vendor zip is missing
    config.modResults.push({
      type: 'property',
      key: 'systemProp.java.net.preferIPv4Stack',
      value: 'true',
    });
    // Fix Prefab [CXX1210] "No compatible library found" for fbjni
    // This disables automatic Prefab component creation which can conflict on newer NDKs
    config.modResults.push({
      type: 'property',
      key: 'android.disableAutomaticComponentCreation',
      value: 'true',
    });
    return config;
  });

  // 2. Patch expo-sqlite android build.gradle to use local vendor zip if available
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const gradlePath = path.join(
        projectRoot,
        'node_modules',
        'expo-sqlite',
        'android',
        'build.gradle'
      );
      if (fs.existsSync(gradlePath)) {
        let content = fs.readFileSync(gradlePath, 'utf8');
        const target = 'src("https://www.sqlite.org/2024/sqlite-amalgamation-${SQLITE_VERSION}.zip")';
        const replacement = `def localZip = new File(rootDir, "../vendor/sqlite-amalgamation-\${SQLITE_VERSION}.zip")
  if (localZip.exists()) {
    src(localZip.toURI().toString())
  } else {
    src("https://www.sqlite.org/2024/sqlite-amalgamation-\${SQLITE_VERSION}.zip")
  }`;
        if (content.includes(target)) {
          content = content.replace(target, replacement);
          fs.writeFileSync(gradlePath, content, 'utf8');
          console.log('[withSqliteAmalgamation] Successfully patched expo-sqlite build.gradle to use local vendor zip');
        }
      }
      return config;
    },
  ]);

  return config;
}

module.exports = withSqliteAmalgamation;
