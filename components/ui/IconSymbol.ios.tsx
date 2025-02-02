import React from 'react';
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { Image, StyleProp, ViewStyle } from 'react-native';

export function IconSymbol({
  image, // Default image
  activeImage, // Active image
  isActive, // Whether the icon is active
  defaultSize,
  activeSize,
  style,
}: {
  image: any; // Image for the inactive state
  activeImage: any; // Image for the active state
  isActive: boolean; // Whether the tab is active
  defaultSize?: number;
  activeSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Image
      source={isActive ? activeImage : image}
      style={[
        {
          width: isActive ? activeSize : defaultSize,
          height: isActive ? activeSize : defaultSize,
          resizeMode: "contain",
        },
        style,
      ]}
    />
  );
}
