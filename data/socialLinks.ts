import { getIcon, IconName } from '../utils/iconService';

// Define interface for social links
export interface SocialLink {
  label: string;
  iconName: IconName;  // Using the IconName type from our service
  url: string;
}

export const socialLinks: SocialLink[] = [
  {
    label: "Twitter",
    iconName: "twitter",
    url: "https://x.com/BTCDistrict"
  },
  {
    label: "Meetup",
    iconName: "meetup",
    url: "https://meetup.com/bitcoin-district"
  },
  {
    label: "Nostr",
    iconName: "kiwiBird",
    url: "https://primal.net/p/npub1mcke7stw5mrqp97lmdu0qdrfcz2uertdsy2n9pzvfnsdutx3hvkq7d5mnw"
  },
  {
    label: "Github",
    iconName: "github",
    url: "https://github.com/bitcoindistrict"
  }
]; 