import { createAuthClient } from "better-auth/react";
import {
  genericOAuthClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    genericOAuthClient(),
    inferAdditionalFields({
      user: {
        phone: {
          type: "string",
          required: true,
        },
        inviteCode: {
          type: "string",
          required: true,
        },
        riotId: {
          type: "string",
          required: true,
        },
        team: {
          type: "string",
          required: true,
        },
        score: {
          type: "number",
        },
        isCompleted: {
          type: "boolean",
        },
        freeDrawChances: {
          type: "number",
        },
      },
    }),
  ],
});
