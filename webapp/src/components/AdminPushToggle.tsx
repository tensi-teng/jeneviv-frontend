import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { disablePush, enablePush, getPushState, type PushState } from "@/lib/push";
import { Button } from "@/components/ui";

/** Lets an admin turn on browser alerts for new workspaces waiting for approval. */
export default function AdminPushToggle() {
  const { success, error: toastError } = useToast();
  const [state, setState] = useState<PushState | "loading">("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getPushState().then(setState).catch(() => setState("off"));
  }, []);

  if (state === "loading" || state === "unsupported") return null;

  const messages: Partial<Record<PushState, string>> = {
    unconfigured: "Push alerts are not set up on the server yet.",
    denied: "Notifications are blocked in this browser. Allow them in site settings to turn this on.",
  };

  const toggle = async () => {
    setBusy(true);
    try {
      if (state === "on") {
        setState(await disablePush());
        success("Alerts off", "This browser will no longer get approval alerts.");
      } else {
        const next = await enablePush();
        setState(next);
        if (next === "on") success("Alerts on", "You'll be notified when a workspace applies.");
        else if (next === "unconfigured") toastError("Not set up", messages.unconfigured!);
        else if (next === "denied") toastError("Blocked", messages.denied!);
      }
    } catch {
      toastError("Could not update alerts", "Try again in a moment.");
    } finally {
      setBusy(false);
    }
  };

  const on = state === "on";
  return (
    <div className="flex flex-wrap items-center gap-2">
      {messages[state] ? (
        <span className="text-[12px] text-ink-muted">{messages[state]}</span>
      ) : null}
      {state !== "denied" && state !== "unconfigured" ? (
        <Button
          variant="secondary"
          onClick={toggle}
          loading={busy}
          icon={on ? <BellOff size={14} /> : <Bell size={14} />}
        >
          {on ? "Turn off alerts" : "Alert me to applications"}
        </Button>
      ) : null}
    </div>
  );
}
