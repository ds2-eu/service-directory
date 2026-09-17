$exit = New-Object System.Management.Automation.Host.ChoiceDescription '&0 Exit', 'Exit'
$local = New-Object System.Management.Automation.Host.ChoiceDescription '&1 Local', 'Local'
$test = New-Object System.Management.Automation.Host.ChoiceDescription '&2 WASP Test', 'WASP Test Server build Eg https://xxxxx.icelab.cloud'
$pharaon = New-Object System.Management.Automation.Host.ChoiceDescription '&3 Pharaon', 'Pharaon build Eg https://xxxx.pharaon.icelab.cloud'
$orchestrationtest = New-Object System.Management.Automation.Host.ChoiceDescription '&4 Orchestration Test', 'Orchestration Test Server build Eg https://orchestration-test.icelab.cloud/xxxx/'
$orchestration = New-Object System.Management.Automation.Host.ChoiceDescription '&5 Orchestration', 'Orchestration Production Server build Eg https://orchestration.icelab.cloud/xxxx/'
$ds2 = New-Object System.Management.Automation.Host.ChoiceDescription '&6 DS2', 'DS2 build Eg ghcr.io/ds2-eu/charts'


$options = [System.Management.Automation.Host.ChoiceDescription[]]($exit, $local, $test, $pharaon, $orchestrationtest, $orchestration, $ds2)

$title = 'Build type'
$message = 'Please select target build'
$localPath = 'informationcatalyst'
$gitlabPath = 'git.icelab.cloud/wasp/deployment'
$ds2Charts = 'ghcr.io/ds2-eu/ds2charts'

$imageTagDefault = 'servicedirectoryapi:latest'
$imageTagDs2 = 'servicedirectoryapi:1.0.0'
$result = $host.ui.PromptForChoice($title, $message, $options, 0)

switch ($result) {
  0 {
    # Exit
  }
  1 {
    # Local (No Path)
    'Building for Local'

    npm run build
    docker build . -t $localPath/$imageTagDefault
  }
  2 {
    # WASP Test Server, domains
    'Building for WASP Test Server'

    npm run build
    docker build . -t $gitlabPath/test-server/$imageTagDefault
    docker push $gitlabPath/test-server/$imageTagDefault
  }
  3 {
    # Pharaon, domains
    'Building for PHARAON server'

    npm run build
    docker build . -t $gitlabPath/pharaon/$imageTagDefault
    docker push $gitlabPath/pharaon/$imageTagDefault
  }
  4 {
    # Orchestration Test, paths
    'Building for ORCHESTRATION Test Server'

    npm run build
    docker build . -t $gitlabPath/orchestration-test/$imageTagDefault
    docker push $gitlabPath/orchestration-test/$imageTagDefault
  }
  5 {
    # Orchestration Production, paths
    'Building for ORCHESTRATION Production Server'

    npm run build
    docker build . -t $gitlabPath/orchestration/$imageTagDefault
    docker push $gitlabPath/orchestration/$imageTagDefault
  }
  6 {
    # DS2 Root Domain
    'Building for DS2 server'

    #npm run prod
    docker build . -t $ds2Charts/$imageTagDs2
    docker push $ds2Charts/$imageTagDs2
  }
}
