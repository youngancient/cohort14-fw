import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VaultSidebar } from "@/components/VaultSidebar";
import { MobileNavDrawer } from "@/components/MobileNavDrawer";
import { MOCK_SIGNERS } from "@/lib/mock-data";
import { truncateAddress } from "@/lib/multisig-types";
import { changeSigner, changeOwner } from "@/lib/contract";
import { Menu, User, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [newSigner, setNewSigner] = useState("");
  const [oldSigner, setOldSigner] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [isChangingSigner, setIsChangingSigner] = useState(false);
  const [isChangingOwner, setIsChangingOwner] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleChangeSigner = async () => {
    if (!oldSigner || !newSigner) return;

    setIsChangingSigner(true);
    try {
      await changeSigner(oldSigner, newSigner);
      toast.success("Signer changed successfully!");
      setOldSigner("");
      setNewSigner(" ");
    } catch (error) {
      console.error("Error changing signer:", error);
      toast.error(
        "Failed to change signer. Please check your permissions and try again.",
      );
    } finally {
      setIsChangingSigner(false);
    }
  };

  const handleChangeOwner = async () => {
    if (!newOwner) return;

    setIsChangingOwner(true);
    try {
      await changeOwner(newOwner);
      toast.success("Owner changed successfully!");
      setNewOwner("");
    } catch (error) {
      console.error("Error changing owner:", error);
      toast.error(
        "Failed to change owner. Please check your permissions and try again.",
      );
    } finally {
      setIsChangingOwner(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-background text-foreground">
      <MobileNavDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex w-full">
        <div className="hidden lg:flex">
          <VaultSidebar />
        </div>
        <main className="flex flex-1 flex-col min-w-0">
          <header
            className="border-b border-border px-4 py-4 sm:px-6 lg:px-8"
            style={{ touchAction: "manipulation" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/60 text-muted-foreground transition hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  onClick={() => setMobileNavOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation</span>
                </button>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage signers, ownership, and vault permissions.
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                {MOCK_SIGNERS.length} trusted signers
              </p>
            </div>
          </header>

          <section className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <Card className="bg-surface shadow-sm shadow-black/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Current Signers
                  </CardTitle>
                  <CardDescription>
                    Manage the signers for this multisig vault
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {MOCK_SIGNERS.map((signer, index) => (
                      <div
                        key={signer}
                        className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">Signer {index + 1}</span>
                          <span className="font-mono text-sm text-muted-foreground">
                            {truncateAddress(signer)}
                          </span>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Active
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface shadow-sm shadow-black/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Change Signer
                  </CardTitle>
                  <CardDescription>
                    Replace an existing signer with a new address (Owner only)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="oldSigner">Current Signer Address</Label>
                      <Input
                        id="oldSigner"
                        placeholder="0x..."
                        value={oldSigner}
                        onChange={(e) => setOldSigner(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newSigner">New Signer Address</Label>
                      <Input
                        id="newSigner"
                        placeholder="0x..."
                        value={newSigner}
                        onChange={(e) => setNewSigner(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleChangeSigner}
                    disabled={!oldSigner || !newSigner || isChangingSigner}
                    className="w-full min-h-[48px]"
                    style={{ touchAction: "manipulation" }}
                  >
                    {isChangingSigner ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Changing Signer...
                      </>
                    ) : (
                      "Change Signer"
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-surface shadow-sm shadow-black/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Change Owner
                  </CardTitle>
                  <CardDescription>
                    Transfer ownership of the multisig vault (Owner only)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newOwner">New Owner Address</Label>
                    <Input
                      id="newOwner"
                      placeholder="0x..."
                      value={newOwner}
                      onChange={(e) => setNewOwner(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleChangeOwner}
                    disabled={!newOwner || isChangingOwner}
                    className="w-full min-h-[48px]"
                    style={{ touchAction: "manipulation" }}
                  >
                    {isChangingOwner ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Changing Owner...
                      </>
                    ) : (
                      "Change Owner"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
