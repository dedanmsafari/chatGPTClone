import { View, Text, Platform } from "react-native";
import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import Colors from "@/constants/Colors";

type HeaderDropDownProps = {
  title: string;
  selected?: string;
  items: Array<{ key: string; title: string; icon: string }>;
  onSelect: (key: string) => void;
};

const HeaderDropDown = ({
  title,
  selected,
  items,
  onSelect,
}: HeaderDropDownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
          <Text
            style={{
              fontFamily: Platform.select({
                android: "Ubuntu_500Medium",
                ios: "Ubuntu-Medium",
              }),
              fontSize: 20,
            }}
          >
            {title}
          </Text>
          {selected && (
            <Text
              style={{
                fontFamily: Platform.select({
                  android: "Ubuntu_500Medium",
                  ios: "Ubuntu-Medium",
                }),
                fontSize: 15,

                color: Colors.greyLight,
              }}
            >
              {selected} &gt;
            </Text>
          )}
        </View>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        loop={false}
        side="bottom"
        align="start"
        alignOffset={0}
        avoidCollisions={true}
        collisionPadding={10}
        sideOffset={5}
      >
        {items.map((item) => (
          <DropdownMenu.Item key={item.key} onSelect={() => onSelect(item.key)}>
            <DropdownMenu.ItemTitle>{item.title}</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{
                name: item.icon,
                pointSize: 18,
              }}
            />
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default HeaderDropDown;
