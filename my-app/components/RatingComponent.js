import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";

const RatingComponent = () => {
  const [rating, setRating] = useState(0);

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starIcon =
        i <= rating
          ? require("../assets/icon/star_filled.png")
          : require("../assets/icon/star_empty.png");
      stars.push(
        <TouchableOpacity
          key={i}
          style={styles.starButton}
          onPress={() => handleStarPress(i)}
        >
          <Image source={starIcon} style={styles.starImage} />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={styles.ratingContainer}>
      <View style={styles.starsContainer}>{renderStars()}</View>
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Rating</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
  },
  starButton: {
    padding: 5,
  },
  starImage: {
    width: 30,
    height: 30,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: "#FDF3E6",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default RatingComponent;
