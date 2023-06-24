import { ProjectShape, TestShape } from '@seleniumhq/side-model'
import { PlaybackEventShapes, WebDriverExecutor } from '@seleniumhq/side-runtime'
import { Command } from 'commander'

export type JSON =
  | null
  | string
  | number
  | boolean
  | JSON[]
  | { [key: string]: JSON }

export interface Project extends ProjectShape {
  path: string
}

export type ProxyType =
  | 'autodetect'
  | 'direct'
  | 'manual'
  | 'pac'
  | 'socks'
  | 'system'

export type ProxyInputOptions =
  | string
  | Record<string, string | string[] | number>

export type ProxyCapabilities = {
  proxyType: 'autodetect' | 'direct' | 'manual' | 'pac' | 'system'
  proxyAutoconfigUrl?: string
  ftpProxy?: string
  httpProxy?: string
  noProxy?: string[]
  sslProxy?: string
  socksProxy?: string
  socksVersion?: number
}

export interface SideRunnerCLIConfig {
  // Override the base URL that was set in the IDE
  baseUrl: string
  // Webdriver capabilities
  capabilities: string
  // Use specified YAML file for configuration. (default: .side.yml)
  configFile: string
  // Print debug logs
  debug: boolean
  // Print debug startup logs
  debugStartup: boolean
  // Run suites matching name
  filter: string
  // Forcibly run the project, regardless of project's version
  force: boolean
  // Options to configure Jest
  jestOptions: string
  // Maximum amount of workers that will run your tests, defaults to number of cores
  maxWorkers: number
  // Proxy options to pass, for use with manual, pac and socks proxies
  proxyOptions?: string
  // Type of proxy to use (one of: direct, manual, pac, socks, system)
  proxyType?: ProxyType
  // Retries for failed tests
  retries: number
  // Webdriver remote server
  server: string
  // The maximimum amount of time, in milliseconds, to spend attempting to locate
  // an element. (default: ${DEFAULT_TIMEOUT})
  timeout: number
}

export type SideRunnerAPI = Command & SideRunnerCLIConfig

export type Configuration = Required<
  Pick<
    SideRunnerCLIConfig,
    'baseUrl' | 'filter' | 'maxWorkers' | 'server' | 'timeout'
  >
> &
  Pick<
    SideRunnerCLIConfig,
    'debugStartup' | 'debug' | 'force' | 'proxyType' | 'retries'
  > & {
    capabilities: Record<string, JSON>
    projects: string[]
    proxyOptions: ProxyInputOptions
    runId: string
    path: string
    screenshotFailureDirectory?: string
    testHookFiles?: string[]
  }

  export type CustomTestHookInput = {
    logger: Console
    project: ProjectShape
    test: TestShape
    webDriverExec: WebDriverExecutor
    playbackLastCommandState?: PlaybackEventShapes["COMMAND_STATE_CHANGED"]
    sideRunnerConfig: Configuration
  }

  export interface CustomTestHooks {
    /**
     * This hook will be called after the test completes (regardless of status, even from error)
     * BUT before cleanup is done, so the webdriver is still available.
     * @param input 
     * @returns 
     */
    onTestCompleteBeforeCleanup?: (input: CustomTestHookInput) => Promise<void>

    /**
     * This hook will be called after the test completes (regardless of status, even from error)
     * AND after cleanup is done, so the webdriver is not available.
     * @param input 
     * @returns 
     */
    onTestCompleteAfterCleanup?: (input: CustomTestHookInput) => Promise<void>
  }

  export type CustomTestHookCollection = {
    //TJM: Note that the key should be something unique like the file path since 
    //    there could be multiple hooks to run for a single hook name spread across different files.
    [key: string]: CustomTestHooks
  }