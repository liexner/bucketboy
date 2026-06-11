# Bucketboy

A lightweight S3 bucket browser with OIDC authentication and role-based access control. Browse files and folders across S3-compatible storage, with support for restricting which buckets regular users can see.

## Features

- Browse S3-compatible buckets and folders
- OIDC/SSO login (Keycloak and others)
- Role-based access: admins see all buckets, users see only allowed buckets
- File download support
- Docker-ready

## Docker

```bash
docker run -p 3000:3000 \
  -e AUTH_SECRET=your-random-secret \
  -e OIDC_ENABLE=true \
  -e OIDC_ISSUER=https://your-keycloak/realms/your-realm \
  -e OIDC_CLIENT_ID=your-client-id \
  -e OIDC_CLIENT_SECRET=your-client-secret \
  -e S3_ENDPOINT=https://your-s3-endpoint \
  -e S3_REGION=us-east-1 \
  -e S3_ACCESS_KEY=your-access-key \
  -e S3_SECRET_KEY=your-secret-key \
  -e USER_BUCKETS=photos,documents \
  yourusername/bucketboy
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `AUTH_SECRET` | Yes | Random secret for session encryption |
| `OIDC_ENABLE` | No | Set to `true` to enable OIDC login |
| `OIDC_ISSUER` | Yes (if OIDC) | OIDC issuer URL |
| `OIDC_CLIENT_ID` | Yes (if OIDC) | OIDC client ID |
| `OIDC_CLIENT_SECRET` | Yes (if OIDC) | OIDC client secret |
| `S3_ENDPOINT` | No | S3-compatible endpoint (omit for AWS) |
| `S3_REGION` | No | S3 region (default: `us-east-1`) |
| `S3_ACCESS_KEY` | Yes | S3 access key |
| `S3_SECRET_KEY` | Yes | S3 secret key |
| `USER_BUCKETS` | No | Comma-separated list of buckets regular users can see. If unset, all users see all buckets. |

## Keycloak Setup

1. Create a client role called `admin` on your client
2. Add a **User Client Role** mapper to your client's dedicated scope:
   - Token Claim Name: `roles`
   - Multivalued: ON
   - Add to ID token: ON
3. Assign the `admin` role to admin users

## Development

```bash
npm install
npm run dev
```
