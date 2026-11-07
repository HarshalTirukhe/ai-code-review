# GitHub App setup

The service runs as a GitHub App, so it has its own identity and only the permissions it needs.

## Settings

| Setting | Value |
|---|---|
| Webhook | Active, URL points at the API's `/webhooks/github` (in development, a smee.io proxy) |
| Webhook secret | A random 32-byte hex string, stored in `GITHUB_WEBHOOK_SECRET` |
| Repository permissions | Pull requests: Read and write. Metadata: Read-only |
| Subscribed events | Pull request |
| Installation | Only on the owner's account, on selected repositories |

## Credentials

| Variable | Where it comes from |
|---|---|
| `GITHUB_APP_ID` | The App ID on the app's settings page |
| `GITHUB_WEBHOOK_SECRET` | The secret entered in the app's webhook settings |
| `GITHUB_PRIVATE_KEY_PATH` | A private key generated on the app's settings page, stored outside the repository |

The private key and webhook secret are never committed. `*.pem` is in `.gitignore`.

## Local development

GitHub can't reach `localhost`, so development uses a [smee.io](https://smee.io) channel as the webhook URL, forwarded to the local server. smee channels are public, so use a public test repository, never a private one.

## Testing

Install the app on a throwaway repository, open a pull request there, and check that a `pull_request` event arrives.