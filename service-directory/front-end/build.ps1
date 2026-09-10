$exit = New-Object System.Management.Automation.Host.ChoiceDescription '&0 Exit', 'Exit'
$localNoPath = New-Object System.Management.Automation.Host.ChoiceDescription '&1 Local (No Path)', 'Local (No Path) Eg http://localhost:4203'
$localWithPath = New-Object System.Management.Automation.Host.ChoiceDescription '&2 Local (With Path)', 'Local (With Path) Eg http://localhost:4203/service-directory/'
$test = New-Object System.Management.Automation.Host.ChoiceDescription '&3 WASP Test', 'WASP Test Server build Eg https://service-directory-test.icelab.cloud'
$pharaon = New-Object System.Management.Automation.Host.ChoiceDescription '&4 Pharaon', 'Pharaon build Eg https://service-directory.pharaon.icelab.cloud'
$orchestrationtest = New-Object System.Management.Automation.Host.ChoiceDescription '&5 Orchestration Test', 'Orchestration Test Server build Eg https://orchestration-test.icelab.cloud/service-directory/'
$orchestration = New-Object System.Management.Automation.Host.ChoiceDescription '&6 Orchestration', 'Orchestration Production Server build Eg https://orchestration.icelab.cloud/service-directory/'
$ds2 = New-Object System.Management.Automation.Host.ChoiceDescription '&7 DS2', 'DS2 build Eg ghcr.io/ds2-eu/charts'

$options = [System.Management.Automation.Host.ChoiceDescription[]]($exit, $localNoPath, $localWithPath, $test, $pharaon, $orchestrationtest, $orchestration, $ds2)

$title = 'Build type'
$message = 'Please select target build'
$localPath = 'informationcatalyst'
$gitlabPath = 'git.icelab.cloud/wasp/deployment'
$ds2Charts = 'ghcr.io/ds2-eu/ds2charts'

$imageTagDefault = 'service-directory:latest'
$imageTagDs2 = 'service-directory:1.0.0'
$result = $host.ui.PromptForChoice($title, $message, $options, 0)

switch ($result) {
  0 {
    # Exit
  }
  1 {
    # Local (No Path)
    'Building for Local (No Path)'

    npm run build
    docker build . -t $localPath/$imageTagDefault
  }
  2 {
    # Local (With Path)
    'Building for Local (With Path)'

    npm run build-path
    docker build . -t $localPath/$imageTagDefault -f Dockerfile-path
  }
  3 {
    # WASP Test Server, domains
    'Building for WASP Test Server'

    npm run prod
    docker build . -t $gitlabPath/test-server/$imageTagDefault
    docker push $gitlabPath/test-server/$imageTagDefault
  }
  4 {
    # Pharaon, domains
    'Building for PHARAON server'

    npm run prod
    docker build . -t $gitlabPath/pharaon/$imageTagDefault
    docker push $gitlabPath/pharaon/$imageTagDefault
  }
  5 {
    # Orchestration Test, paths
    'Building for ORCHESTRATION Test Server'

    npm run prod-path
    docker build . -t $gitlabPath/orchestration-test/$imageTagDefault -f Dockerfile-path
    docker push $gitlabPath/orchestration-test/$imageTagDefault
  }
  6 {
    # Orchestration Production, paths
    'Building for ORCHESTRATION Production Server'

    npm run prod-path
    docker build . -t $gitlabPath/orchestration/$imageTagDefault -f Dockerfile-path
    docker push $gitlabPath/orchestration/$imageTagDefault
  }
  7 {
    # DS2 Root Domain
    'Building for DS2 server'

    npm run prod
    docker build . -t $ds2Charts/$imageTagDs2
    docker push $ds2Charts/$imageTagDs2
  }
}
