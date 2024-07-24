import { CustomerInfo } from 'react-native-purchases';
import Purchases, { LOG_LEVEL, PurchasesPackage } from 'react-native-purchases';
import { createContext } from '@/utils/context';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

const APIKeys = {
  apple: process.env.EXPO_PUBLIC_RC_APPLE_KEY as string,
  google: process.env.EXPO_PUBLIC_RC_GOOGLE_KEY as string,
};

export interface UserState {
  dalle: boolean;
}

interface RevenueCatProps {
  purchasePackage: (pack: PurchasesPackage) => Promise<void>;
  restorePermissions: () => Promise<CustomerInfo>;
  user: UserState;
  packages: PurchasesPackage[];
}

const [useContext, Provider] = createContext<RevenueCatProps>();

export const useRevenueCat = useContext;

const RevenueCatProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserState>({ dalle: false });
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        await Purchases.configure({ apiKey: APIKeys.google });
      } else {
        await Purchases.configure({ apiKey: APIKeys.google });
      }
      setIsReady(true);
      //logging events
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);

      //Listen for customer updates
      Purchases.addCustomerInfoUpdateListener(async (info) => {
        updateCustomerInformation(info);
      });

      //Load all offerings and the user object with entitlements
      await loadOfferings();
    };

    init();
  }, []);

  //load all offerings a user can (currently) purchase
  const loadOfferings = async () => {
    const offerings = await Purchases.getOfferings();
    if (offerings.current) {
      setPackages(offerings.current.availablePackages);
    }
  };

  //Update user state based on previous purchases
  const updateCustomerInformation = async (customerInfo: CustomerInfo) => {
    const newUser: UserState = { dalle: user.dalle };

    if (customerInfo?.entitlements.active['DallE'] !== undefined) {
      newUser.dalle = true;
    }

    setUser(newUser);
  };

  const purchasePackage = async (pack: PurchasesPackage) => {
    try {
      await Purchases.purchasePackage(pack);
      if (pack.identifier === 'dalle') {
        setUser({ dalle: true });
        Alert.alert('Success', 'You have unlocked DallE!');
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        alert(e);
      }
    }
  };

  //restore previous purchases
  const restorePermissions = async () => {
    const customer = await Purchases.restorePurchases();
    return customer;
  };

  const value = {
    restorePermissions,
    user,
    packages,
    purchasePackage,
  };

  if (!isReady) return <></>;

  return <Provider value={value}>{children}</Provider>;
};

export default RevenueCatProvider;
