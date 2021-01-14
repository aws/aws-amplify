import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';

function assert(message) {
	throw new Error(message);
}

const {
	CONTEXT,
	DESCRIPTION,
	GITHUB_REPOSITORY = assert('Missing GITHUB_REPOSITORY'),
	GITHUB_TOKEN = assert('Missing GITHUB_TOKEN'),
	STATE = 'pending',
} = process.env;

const [owner, repo] = GITHUB_REPOSITORY.split('/');
const sha = execSync('git rev-parse head')
	.toString()
	.trim();

const { repos } = new Octokit({
	auth: GITHUB_TOKEN,
	userAgent: 'status-check-action',
	baseUrl: 'https://api.github.com',
	log: {
		debug: console.debug,
		error: console.error,
		info: console.info,
		warn: console.warn,
	},
	request: {
		agent: undefined,
		fetch: undefined,
		timeout: 0,
	},
});

await repos.createCommitStatus({
	context: CONTEXT,
	description: DESCRIPTION,
	state: STATE,
	owner,
	repo,
	sha,
});