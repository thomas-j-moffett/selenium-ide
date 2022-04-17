import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { CommandShape } from '@seleniumhq/side-model'
import { CoreSessionData } from 'api/types'
import React, { FC } from 'react'
import CommandSelector from './CommandFields/CommandSelector'
import ArgField from './CommandFields/ArgField'
import CommandTextField from './CommandFields/TextField'

export interface CommandEditorProps {
  command: CommandShape
  commands: CoreSessionData['state']['commands']
  selectedCommands: string[]
  testID: string
}

export interface MiniCommandShape {
  id: string
  name: string
}

const CommandEditor: FC<CommandEditorProps> = ({
  command,
  selectedCommands,
  ...props
}) => {
  if (selectedCommands.length !== 1) {
    return (
      <Stack className="p-4" spacing={1}>
        <Typography className="centered py-4" variant="body2">
          {selectedCommands.length === 0
            ? 'No command selected'
            : `${selectedCommands.length} commands selected`}
        </Typography>
      </Stack>
    )
  }
  const isDisabled = command.command.startsWith('//')
  const correctedCommand: CommandShape = {
    ...command,
    command: isDisabled ? command.command.slice(2) : command.command,
  }
  return (
    <Stack className="p-4" spacing={1}>
      <CommandSelector
        command={correctedCommand}
        isDisabled={isDisabled}
        {...props}
      />
      <ArgField command={correctedCommand} {...props} fieldName="target" />
      <ArgField command={correctedCommand} {...props} fieldName="value" />
      <CommandTextField
        command={correctedCommand}
        {...props}
        fieldName="comment"
      />
    </Stack>
  )
}

export default CommandEditor