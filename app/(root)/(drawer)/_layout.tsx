import React, { useEffect, useState } from 'react';
import { Drawer } from 'expo-router/drawer';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Keyboard,
  Alert,
} from 'react-native';
import { Link, router, useNavigation, useRouter } from 'expo-router';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { TextInput } from 'react-native-gesture-handler';
import { useSQLiteContext } from 'expo-sqlite';
import Dialog from 'react-native-dialog';
import {
  deleteChat,
  deleteMessages,
  getChats,
  renameChat,
} from '@/utils/Database';
import { Chat } from '@/utils/types';
import uuid from 'react-native-uuid';

import * as ContextMenu from 'zeego/context-menu';
import { useRevenueCat } from '@/providers/RevenueCat';

export const CustomDrawerContent = (props: any) => {
  const [history, setHistory] = useState<Array<Chat>>([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<null | number>(null);
  const [newChatName, setNewChatName] = useState('');

  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const router = useRouter();

  useEffect(() => {
    if (isDrawerOpen) {
      loadChats();
    }
    Keyboard.dismiss();
  }, [isDrawerOpen]);

  const loadChats = () => {
    getChats(db).then((results) => {
      console.log('results from loadChat: ', results);

      setHistory(results);
    });
  };

  const onDeleteChat = async (id: number) => {
    Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          await deleteChat(db, id);
          await deleteMessages(db, id);
          loadChats();
          router.navigate('/(root)/(drawer)/(chat)/new');
        },
      },
    ]);
  };

  const onRenameChat = async (id: number) => {
    console.warn('renaming:', id);
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Rename Chat',
        'Enter a new name for the chat',
        async (newName) => {
          if (newName) {
            await renameChat(db, id, newName);
            loadChats();
          }
        }
      );
    } else {
      setCurrentChatId(id);
      setIsDialogVisible(true);
    }
  };

  const handleSubmit = async () => {
    if (newChatName && currentChatId !== null) {
      await renameChat(db, currentChatId, newChatName);
      loadChats();
      setIsDialogVisible(false);
      setNewChatName('');
      setCurrentChatId(null);
    }
  };

  return (
    <View style={{ flex: 1, marginTop: insets.top }}>
      <View
        style={{
          backgroundColor: 'white',
          paddingBottom: 16,
        }}
      >
        <View style={styles.searchSection}>
          <Ionicons
            style={styles.searchIcon}
            name="search"
            size={20}
            color={Colors.greyLight}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            underlineColorAndroid={'transparent'}
            cursorColor={Colors.greyLight}
          />
        </View>
      </View>

      <DrawerContentScrollView
        contentContainerStyle={{ paddingTop: 0 }}
        {...props}
      >
        <DrawerItemList {...props} />
        {history.map((chat) => (
          <ContextMenu.Root key={chat.id}>
            <ContextMenu.Trigger action="longPress">
              <DrawerItem
                label={chat.title}
                inactiveTintColor="#000"
                onPress={() =>
                  router.push(`/(root)/(drawer)/(chat)/${chat.id}`)
                }
              />
            </ContextMenu.Trigger>
            <ContextMenu.Content
              loop={false}
              alignOffset={10}
              avoidCollisions={true}
              collisionPadding={20}
            >
              <ContextMenu.Preview>
                {() => (
                  <View
                    style={{
                      padding: 16,
                      height: 200,
                      width: 250,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text>{chat.title}</Text>
                  </View>
                )}
              </ContextMenu.Preview>
              <ContextMenu.Item
                key="rename"
                onSelect={() => onRenameChat(chat.id)}
              >
                <ContextMenu.ItemTitle>Rename</ContextMenu.ItemTitle>
                <ContextMenu.ItemIcon
                  ios={{
                    name: 'pencil',
                    pointSize: 18,
                  }}
                />
              </ContextMenu.Item>
              <ContextMenu.Item
                key="delete"
                onSelect={() => onDeleteChat(chat.id)}
              >
                <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
                <ContextMenu.ItemIcon
                  ios={{
                    name: 'trash',
                    pointSize: 18,
                  }}
                />
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
        ))}
      </DrawerContentScrollView>

      <View style={{ padding: 16, paddingBottom: insets.bottom + 10 }}>
        <Link href="/(root)/(modal)/settings" asChild>
          <TouchableOpacity style={styles.footer}>
            <Image
              source={require('@/assets/images/robot.jpg')}
              style={styles.avatar}
            />
            <Text style={styles.userName}>Albon Mechatron</Text>
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={Colors.greyLight}
            />
          </TouchableOpacity>
        </Link>
      </View>

      <Dialog.Container visible={isDialogVisible}>
        <Dialog.Title>Rename Chat</Dialog.Title>
        <Dialog.Description>Enter a new name for the chat</Dialog.Description>
        <Dialog.Input value={newChatName} onChangeText={setNewChatName} />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setIsDialogVisible(false);
            setNewChatName('');
            setCurrentChatId(null);
          }}
        />
        <Dialog.Button label="Submit" onPress={handleSubmit} />
      </Dialog.Container>
    </View>
  );
};

const _layout = () => {
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();

  const { user } = useRevenueCat();
  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}
            style={{ marginLeft: 16 }}
          >
            <FontAwesome6 name="grip-lines" size={20} color={Colors.grey} />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: Colors.light },
        headerTitleStyle: {
          fontFamily: Platform.select({
            android: 'Ubuntu_500Medium',
            ios: 'Ubuntu-Medium',
          }),
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        drawerActiveBackgroundColor: Colors.selected,
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        overlayColor: 'rgba(0,0,0,0.2)',
        drawerItemStyle: { borderRadius: 12 },

        drawerLabelStyle: {
          marginLeft: -20,
          fontFamily: 'PlaywritePL-Regular',
        },
        drawerStyle: { width: dimensions.width * 0.86 },
      }}
    >
      <Drawer.Screen
        name="(chat)/new"
        getId={() => {
          return uuid.v4().toString();
        }}
        options={{
          drawerLabel: 'ChatGPT',
          title: 'ChatGPT',
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: '#000' }]}>
              <Image
                source={require('@/assets/images/logo-white.png')}
                style={styles.Image}
              />
            </View>
          ),
          headerRight: () => (
            <Link href="/(root)/(drawer)/(chat)/new" push asChild>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="(chat)/[id]"
        options={{
          drawerItemStyle: {
            display: 'none',
          },
          headerRight: () => (
            <Link href="/(root)/(drawer)/(chat)/new" push asChild>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="dalle"
        options={{
          drawerLabel: 'DALL · E',

          title: 'Generate Images',

          drawerIcon: () => (
            <View style={styles.item}>
              <Image
                source={require('@/assets/images/dalle.png')}
                style={styles.dalleImage}
              />
            </View>
          ),
        }}
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault();
            console.log('Dall.E');
            if (user.dalle) {
              router.navigate('/(root)/(drawer)/dalle');
            } else {
              router.navigate('/(root)/(modal)/purchases');
            }
          },
        }}
      />
      <Drawer.Screen
        name="explore"
        getId={() => String(Date.now())}
        options={{
          drawerLabel: "Explore GPT'S",

          title: "Specific GPT'S",

          drawerIcon: () => (
            <View style={[styles.item]}>
              <Ionicons
                name="apps"
                size={18}
                color={'#000'}
                style={{ margin: 6 }}
              />
            </View>
          ),
        }}
      />
    </Drawer>
  );
};

export default _layout;

const styles = StyleSheet.create({
  Image: {
    width: 16,
    height: 16,
    margin: 6,
  },
  item: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  dalleImage: {
    width: 28,
    height: 28,
    resizeMode: 'cover',
  },
  searchSection: {
    flexDirection: 'row',
    marginHorizontal: 12,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.input,
    borderRadius: 10,
  },
  searchIcon: {
    padding: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingRight: 8,
    paddingLeft: 0,
    alignItems: 'center',
    color: '#424242',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  userName: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlaywritePL-Regular',
  },
});
