import React from "react";
import { PieChart } from "react-native-svg-charts";
import { Text as SvgText } from "react-native-svg";
import { Text, DataTable } from "react-native-paper";
import tw from "twrnc";
import { View } from "react-native-web";

const Summary = () => {
  const data = [
    {
      key: 1,
      name: "Moisturizing",
      amount: 8,
      color: "#CF9BBD",
      svg: { fill: "#CF9BBD" },
    },
    {
      key: 2,
      name: "Exfoliation",
      amount: 11,
      color: "#FDE3DF",
      svg: { fill: "#FDE3DF" },
    },
    {
      key: 3,
      name: "Reconstruction",
      amount: 4,
      color: "#E6BFCE",
      svg: { fill: "#E6BFCE" },
    },
    {
      key: 4,
      name: "Break",
      amount: 8,
      color: "#CA498C",
      svg: { fill: "#CA498C" },
    },
  ];

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  const calculatePercentage = (amount) => {
    return (amount / totalAmount) * 100;
  };
  const dataWithPercentage = data.map((item) => ({
    ...item,
    percentage: calculatePercentage(item.amount),
  }));

  const Labels = ({ slices, height, width }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, pieCentroid, data } = slice;
      return (
        <SvgText
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill={"black"}
          textAnchor={"middle"}
          alignmentBaseline={"middle"}
          fontSize={18}
          stroke={"black"}
          strokeWidth={0.2}
          fontFamily="roboto"
        >
          {`${data.percentage.toFixed(2)}%`}
        </SvgText>
      );
    });
  };

  return (
    <View>
      <Text
        variant="headlineSmall"
        style={tw`p-6 mt-1 text-black text-center font-bold`}
        testID="header-welcome-text"
      >
        Summary of this month
      </Text>
      <View>
        <PieChart
          style={{ height: 280 }}
          valueAccessor={({ item }) => item.amount}
          data={dataWithPercentage}
          spacing={0}
          outerRadius={"95%"}
        >
          <Labels />
        </PieChart>
      </View>

      <View style={tw`flex p-8  items-center justify-center rounded-lg`}>
        <DataTable style={tw`border rounded-lg border-black w-5/6`}>
          <DataTable.Header>
            <DataTable.Title textStyle={tw`text-black text-sm font-bold`}>
              Type of care
            </DataTable.Title>
            <DataTable.Title textStyle={tw`text-black text-sm font-bold`}>
              Number of occurrences
            </DataTable.Title>
          </DataTable.Header>
          {data.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell textStyle={tw`text-black`}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: item.color,
                    marginRight: 10,
                  }}
                />
                {item.name}
              </DataTable.Cell>
              <DataTable.Cell
                style={tw`justify-center`}
                textStyle={tw`text-black text-center`}
              >
                {item.amount}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    </View>
  );
};

export default Summary;
