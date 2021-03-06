const exec = require('child_process').exec;

const teamInfo = require('../amplify/team-provider-info.json');

const {
    AWS_BRANCH
} = process.env;

let ENV;
switch (AWS_BRANCH) {
    case 'master':
        ENV = 'prd';
        break;
    default:
        ENV = AWS_BRANCH;
        break;
}

const envInfo = teamInfo[ENV];
if (!envInfo) {
    console.log(`Can not find env ${ENV} in team-provider-info.json`);
    return process.exit(1);
}

const creds = JSON.parse(envInfo.categories.auth.piggybankofhappinesscf2e2c90.hostedUIProviderCreds)
console.log(creds);

const {
    client_id: facebookAppIdUserPool,
    client_secret: facebookAppSecretUserPool
} = creds.find(({
    ProviderName
}) => ProviderName === 'Facebook');

const {
    client_id: googleAppIdUserPool,
    client_secret: googleAppSecretUserPool
} = creds.find(({
    ProviderName
}) => ProviderName === 'Google');

const authConfig = {
    auth: {
        facebookAppIdUserPool,
        facebookAppSecretUserPool,
        googleAppIdUserPool,
        googleAppSecretUserPool,
    }
}

const commands = [
    'amplify init',
    `--amplify "{\\"envName\\":\\"${ENV}\\"}"`,
    `--categories "${JSON.stringify(authConfig).replace(/"/g, '\\"')}"`,
    '--yes',
];

console.log(commands.join(' '));

const event = exec(commands.join(' '));

event.stdout.on('data', console.log);
event.stderr.on('data', console.log);

event.on('exit', process.exit);