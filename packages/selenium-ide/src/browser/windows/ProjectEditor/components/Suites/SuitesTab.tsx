import Paper from '@mui/material/Paper'
import { getActiveSuite } from 'api/helpers/getActiveData'
import React from 'react'
import SuiteEditor from './SuiteEditor'
import AvailableSuiteTestList from './AvailableSuiteTestList'
import { CoreSessionData } from 'api/types'
import MainHeader from '../Main/Header'
import { useHeightFromElement } from 'browser/helpers/useHeightFromElement'
import { TestShape } from '@seleniumhq/side-model'
import CurrentSuiteTestList from './CurrentSuiteTestList'

const SuitesTab: React.FC<{
  session: CoreSessionData
}> = ({ session }) => {
  const activeSuite = getActiveSuite(session)
  const activeTests = activeSuite.tests.map(
    (id) => session.project.tests.find((t) => t.id === id) as TestShape
  )
  const {
    project: { tests },
    state: { activeSuiteID },
  } = session

  const bottomOffset = useHeightFromElement('suite-editor')
  return (
    <>
      <MainHeader />
      <CurrentSuiteTestList
        activeSuite={activeSuiteID}
        bottomOffset={bottomOffset}
        tests={activeTests}
      />
      <AvailableSuiteTestList
        activeSuite={activeSuiteID}
        allTests={tests}
        bottomOffset={bottomOffset}
        tests={activeSuite.tests}
      />
      <Paper
        elevation={1}
        id="suite-editor"
        square
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2000,
        }}
      >
        <SuiteEditor suite={activeSuite} />
      </Paper>
    </>
  )
}

export default SuitesTab