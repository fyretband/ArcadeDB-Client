import { React, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchGame, fetchArcade, fetchBrand } from "../Reducer/game";
const Test = () => {
  const brands = useSelector((state) => state.brands);
  //   const games = useSelector((state) => state.games);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleFetchBrand = async () => {
      await dispatch(fetchBrand());
    };
    handleFetchBrand();
    // const handleFetchGame = async () => {
    //   await dispatch(fetchGame());
    // };
    // handleFetchGame();
  }, []);

  return (
    <ScrollView>
      <View>
        <Text>{JSON.stringify(brands)}</Text>
        {/* <Text>{JSON.stringify(games)}</Text> */}
      </View>
    </ScrollView>
  );
};

// const games = () => {
//   const games = useSelector((state) => state.games);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const handleFetchGame = async () => {
//       await dispatch(fetchGame());
//     };
//     handleFetchGame();
//   }, []);

//   return (
//     <ScrollView>
//       <View>
//         <Text>{JSON.stringify(games)}</Text>
//       </View>
//     </ScrollView>
//   );
// };

export default Test;
