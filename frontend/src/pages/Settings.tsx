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
import { MOCK_SIGNERS } from "@/lib/mock-data";
import { truncateAddress } from "@/lib/multisig-types";
import { changeSigner, changeOwner } from "@/lib/contract";
import { Settings as SettingsIcon, User, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [newSigner, setNewSigner] = useState("");
  const [oldSigner, setOldSigner] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [isChangingSigner, setIsChangingSigner] = useState(false);
  const [isChangingOwner, setIsChangingOwner] = useState(false);

  const handleChangeSigner = async () => {
    if (!oldSigner || !newSigner) return;

    setIsChangingSigner(true);
    try {
      await changeSigner(oldSigner, newSigner);
      toast.success("Signer changed successfully!");
      setOldSigner("");
      setNewSigner("");
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
    <div className="flex min-h-screen bg-background">
      <VaultSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-border px-8 py-5">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium tracking-display">Settings</h2>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-8 py-8 space-y-6">
          {/* Current Signers */}
          <Card>
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
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        Signer {index + 1}
                      </span>
                      <span className="font-mono text-sm text-muted-foreground">
                        {truncateAddress(signer)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Change Signer */}
          <Card>
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
              <div className="grid grid-cols-2 gap-4">
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
                className="w-full"
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

          {/* Change Owner */}
          <Card>
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
                className="w-full"
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
      </main>
    </div>
  );
}
