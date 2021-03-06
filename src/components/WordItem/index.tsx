import React, { useState } from "react";
import { View, Image, Text, Linking } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";

import heartOutlineIcon from "../../assets/images/icons/heart-outline.png";
import unfavoriteIcon from "../../assets/images/icons/unfavorite.png";
import externalLink from "../../assets/images/icons/external-link.png";

import styles from "./styles";

export interface FileData {
  id: string;
  name: string;
  syllabicdivision: string;
  primarymeaning: string;
  translated: string;
  primaryexample?: any;
  primaryreference?: string;
  secondarymeaning?: string;
  secondaryexample?: string;
  secondaryreference?: string;
  __parsed_extra?: any;
}

interface WordItemProps {
  word: FileData;
  favorited: boolean;
  hideFavoriteButton?: boolean;
}

const WordItem: React.FC<WordItemProps> = ({
  word,
  favorited,
  hideFavoriteButton,
}) => {
  const [isFavorited, setIsFavorited] = useState(favorited);
  // console.log(word.name, "favorited: ", favorited);
  // console.log(word.name, "isFavorited: ", isFavorited);

  async function handleToggleFavorite() {
    const favorites = await AsyncStorage.getItem("favorites");

    let favoritesArray: FileData[] = [];

    if (favorites) {
      favoritesArray = JSON.parse(favorites);
      // console.log(favoritesArray);
    }

    if (isFavorited) {
      const favoriteIndex = favoritesArray.findIndex((wordItem: FileData) => {
        return Number(wordItem.id) === Number(word.id);
      });

      favoritesArray.splice(favoriteIndex, 1);

      setIsFavorited(false);
    } else {
      // console.log("Antigo", favoritesArray);

      // const favoriteIndex = favoritesArray.findIndex((wordItem: FileData) => {
      //   return Number(wordItem.id) === Number(word.id);
      // });
      // favoritesArray.splice(favoriteIndex, 1);

      favoritesArray.push(word);

      setIsFavorited(true);

      // console.log("Novo", favoritesArray);
    }

    await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
  }

  function handleOpenReference(url: any) {
    Linking.openURL(url).catch((err: any) =>
      console.error("An error occurred", err)
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.profileInfo}>
          <View style={styles.primaryVision}>
            <Text style={styles.name}>{word.name}</Text>
            <Text style={styles.division}>{word.syllabicdivision}</Text>
          </View>
          <Text style={styles.primarymeaning}> {word.translated} </Text>
        </View>
      </View>

      <Text style={styles.example}>{word.primaryexample}</Text>
      <View style={styles.buttonContainer}>
        {!hideFavoriteButton && (
          <View style={styles.footer}>
            <RectButton
              onPress={handleToggleFavorite}
              style={[
                styles.favoriteButton,
                isFavorited ? styles.favorited : {},
              ]}
            >
              {isFavorited ? (
                <Image source={unfavoriteIcon} />
              ) : (
                <Image source={heartOutlineIcon} />
              )}
            </RectButton>
          </View>
        )}

        <RectButton
          onPress={() => handleOpenReference(word.primaryreference)}
          style={styles.linkReference}
        >
          <Text style={styles.linkText}>Ver referência</Text>
          {/* <Image resizeMode="cover" source={externalLink} /> */}
        </RectButton>
      </View>
    </View>
  );
};

export default WordItem;
