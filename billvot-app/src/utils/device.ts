import { Share as CapacitorShare } from "@capacitor/share";
import { Device } from "@capacitor/device";

export const createShare = async (title: string, content: string) => {
  const { platform } = await Device.getInfo();
  const url =
    platform === "ios"
      ? "https://itunes.apple.com/app/id6744014870"
      : "https://play.google.com/store/apps/details?id=com.orionx.app.teamorionx";

  await CapacitorShare.share({
    title: `${title}`,
    text: `${content.slice(0, 100)}...`,
    url,
    dialogTitle: `${title}`,
  });
};
