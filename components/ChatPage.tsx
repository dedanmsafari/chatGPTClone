import {
  View,
  Image,
  Text,
  Button,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { defaultStyles } from '@/constants/Styles';
import {
  Redirect,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import HeaderDropDown from '@/components/HeaderDropDown';
import MessageInput from '@/components/MessageInput';
import MessageIdeas from '@/components/MessageIdeas';
import { Message, Role } from '@/utils/types';
import { FlashList } from '@shopify/flash-list';
import ChatMessage from '@/components/ChatMessage';

import { useMMKVString } from 'react-native-mmkv';
import { Storage } from '@/utils/mmkvStorage';

import OpenAI from 'react-native-openai';
import { addChat, addMessage, getMessages } from '@/utils/Database';

const ChatPage = () => {
  const [gptVersion, setGptVersion] = useMMKVString('gptVersion', Storage);
  const [messages, setMessages] = useState<Message[]>([]);
  const [height, setHeight] = useState(0);

  const [key, setKey] = useMMKVString('apiKey', Storage);
  const [organization, setOrganization] = useMMKVString('org', Storage);

  const db = useSQLiteContext();
  let { id } = useLocalSearchParams<{ id: string }>();

  const [chatId, _setChatId] = useState(id);
  const chatIdRef = useRef(chatId);

  function setChatId(id: string) {
    chatIdRef.current = id;
    _setChatId(id);
  }

  const openAI = useMemo(
    () =>
      // @ts-ignore
      new OpenAI({
        apiKey: key,
        organization,
      }),
    []
  );

  useEffect(() => {
    if (id) {
      // setChatId(id);
      getMessages(db, parseInt(id)).then((messages) => {
        console.log('Our id:  ', id);
        setMessages(messages);
        // console.log('Our messages array:', messages);
      });
    }
  }, [id]);

  useEffect(() => {
    const handleNewMessage = (payload: any) => {
      setMessages((messages) => {
        const newMessage = payload.choices[0]?.delta?.content;

        if (newMessage) {
          messages[messages.length - 1].content += newMessage;
          console.log(...messages);
          return [...messages];
        }

        if (payload.choices[0]?.finishReason === null) {
          //Save last message to the DB
          console.log(messages);
          console.log('current chat_id', chatIdRef.current!);
          addMessage(db, parseInt(chatIdRef.current!), {
            content: messages[messages.length - 1].content,
            role: Role.Bot,
          });
        }

        return messages;
      });
    };

    //listen for messages
    openAI.chat.addListener('onChatMessageReceived', handleNewMessage);

    return () => {
      openAI.chat.removeListener('onChatMessageReceived');
    };
  }, [openAI]);

  const getCompletion = (message: string) => {
    // console.log('Sending Message after completion: ', message);
    // console.log('Messages array:', messages); //messages array is empty in this situation if no save record
    if (messages.length === 0) {
      // Create chat later,store to DB
      console.log('being called');
      addChat(db, message).then((res) => {
        console.log('response from adding chat: ', res.lastInsertRowId);
        const chatID = res.lastInsertRowId;
        console.log('initial chatID: ', chatID);
        setChatId(chatID.toString());
        addMessage(db, chatID, { content: message, role: Role.User });
      });
    } else {
      console.log('our Id in save', chatId);

      addMessage(db, parseInt(chatId!), {
        content: message,
        role: Role.User,
      });
    }

    setMessages([
      ...messages,
      { role: Role.User, content: message },
      { role: Role.Bot, content: '' },
    ]);

    //send a message.
    openAI.chat.stream({
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      model: gptVersion === '4' ? 'gpt-4' : 'gpt-3.5-turbo',
    });
  };

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;

    setHeight(height);
  };

  if (!key || key === '' || !organization || organization === '') {
    return <Redirect href="/(root)/(modal)/settings" />;
  }

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title="ChatGPT"
              selected={gptVersion}
              onSelect={setGptVersion}
              items={[
                { key: '3.5', title: 'GPT-3.5', icon: 'bolt' },
                { key: '4', title: 'GPT-4', icon: 'sparkles' },
              ]}
            />
          ),
        }}
      />
      <View style={{ flex: 1 }} onLayout={onLayout}>
        {messages.length === 0 && (
          <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
            <Image
              source={require('@/assets/images/logo-white.png')}
              style={styles.Image}
            />
          </View>
        )}

        <FlashList
          data={messages}
          renderItem={({ item }) => <ChatMessage {...item} />}
          estimatedItemSize={400}
          contentContainerStyle={{
            paddingTop: 30,
            paddingBottom: 150,
          }}
          keyboardDismissMode="on-drag"
        />
      </View>
      <KeyboardAvoidingView
        keyboardVerticalOffset={70}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
        }}
      >
        {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
        <MessageInput onShouldSendMessage={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  logoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  Image: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
  },
});
