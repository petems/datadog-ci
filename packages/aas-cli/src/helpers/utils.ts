import {readFile, existsSync} from 'fs'
import {promisify} from 'util'

export const DEFAULT_CONFIG_PATHS = ['datadog-ci.json']

export const getConfig = async (configPath: string) => {
  try {
    const configFile = await promisify(readFile)(configPath, 'utf-8')

    return JSON.parse(configFile) as Record<string, unknown>
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Config file is not correct JSON')
    }
  }
}

const resolveConfigPath = ({
  configPath,
  defaultConfigPaths,
}: {
  configPath?: string
  defaultConfigPaths?: string[]
}): string | undefined => {
  if (configPath) {
    if (existsSync(configPath)) {
      return configPath
    }
    throw new Error('Config file not found')
  }

  if (defaultConfigPaths) {
    for (const path of defaultConfigPaths) {
      if (existsSync(path)) {
        return path
      }
    }
  }

  return undefined
}

export const resolveConfigFromFile = async <T>(
  baseConfig: T,
  params: {configPath?: string; defaultConfigPaths?: string[]}
): Promise<T> => {
  const resolvedConfigPath = resolveConfigPath(params)

  if (!resolvedConfigPath) {
    return baseConfig
  }

  const configFromFile = await getConfig(resolvedConfigPath)

  if (!configFromFile) {
    return baseConfig
  }

  return {...baseConfig, ...configFromFile}
}

export const removeUndefinedValues = <T extends {[key: string]: unknown}>(object: T): T => {
  const cleanedObject = {} as T

  for (const [key, value] of Object.entries(object)) {
    if (value !== undefined) {
      cleanedObject[key as keyof T] = value as T[keyof T]
    }
  }

  return cleanedObject
}

export const maskString = (value: string) => {
  if (value.length <= 8) {
    return '*'.repeat(value.length)
  }

  return value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4)
}
