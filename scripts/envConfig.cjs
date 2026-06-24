/**
 * Load environment variables outside of the Next.js runtime
 */

const { loadEnvConfig } = require('@next/env')

const projectDir = process.cwd()

loadEnvConfig(projectDir)
