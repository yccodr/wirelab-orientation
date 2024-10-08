import { Button } from "@repo/ui/components/ui/button";
import { useToast } from "@repo/ui/hooks/use-toast";
import { useUser } from "@/lib/firebase/auth";
import { storage } from "@/lib/firebase/storage";
import { User } from "firebase/auth";
import { getBlob, getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { cn } from "@repo/ui/lib/utils";
import { CircleX } from "lucide-react";

const sshKeyUrl = (user: User) => {
  const configFileRef = ref(storage, `${user.uid}/vm-key`);
  return getDownloadURL(configFileRef);
};

function DownloadSshKeyBtn() {
  const { toast } = useToast();
  const { user } = useUser();
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (user === null) {
      return;
    }

    sshKeyUrl(user)
      .then((url) => {
        setUrl(url);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
      });
  }, [user]);

  const downloadSshKeyFile = () => {
    if (user === null) {
      console.error("User is null");
      return;
    }

    if (url === null) {
      console.error("URL is null");
      return;
    }

    toast({
      title: "下載中...",
      duration: 1500,
    });

    const VM_KEY_FILENAME = "vm-key";
    const configFileRef = ref(storage, `${user.uid}/${VM_KEY_FILENAME}`);
    getBlob(configFileRef).then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = VM_KEY_FILENAME;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  if (isError) {
    return (
      <Button className="relative" variant="outline" disabled>
        <CircleX className="w-4 h-4 mr-2 text-destructive" />
        <span>無法取得連線金鑰</span>
      </Button>
    );
  }

  return (
    <Button
      className="relative"
      variant="default"
      onClick={downloadSshKeyFile}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="absolute left-0 w-full h-full px-4 flex items-center justify-center">
          <Skeleton className="w-full h-4" />
        </div>
      ) : null}
      <span className={cn({ "opacity-0": isLoading })}>下載 SSH 連線金鑰</span>
    </Button>
  );
}

export default DownloadSshKeyBtn;
