import { useEffect } from "react";
import CompleteUserDataDialog from "./CompleteUserDataDialog";
import RsoDialog from "./RsoDialog";
import { authClient } from "@/libs/auth-client";

function Dialogs() {
  useEffect(() => {
    Object.assign(window, {
      login: () => {
        authClient.signIn.email({
          email: "lqe5qcmwifqc@placeholder.com",
          password: "t1t2t3t4",
        });
      },
    });
  }, []);

  return (
    <>
      <RsoDialog />
      <CompleteUserDataDialog />
    </>
  );
}

export default Dialogs;
