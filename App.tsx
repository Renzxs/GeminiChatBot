import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View,  Text, } from 'react-native';
import { Button, Card, DefaultTheme, MD2Colors, PaperProvider, TextInput, ActivityIndicator} from 'react-native-paper';
import { GoogleGenerativeAI } from "@google/generative-ai";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: MD2Colors.blue900,
    secondary: ''
  }
}

export default function App() {
  const [prompt, setPrompt] = useState<string>("");
  const [aiOutput, setAIOutput] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
    systemInstruction: "your a cartographer/geographer who is knowledgeable in different locations names. You should only answer the name of the location don't make your answer too long.",
  });

  const onSumbitPrompt = async () => {

    if(prompt) {
      setLoading(true);
      const result = await model.generateContent(prompt);
      setAIOutput(result.response.text());
      setLoading(false)
    }
    else {
      Alert.alert("Prompt is empty");
    }
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar animated backgroundColor={MD2Colors.blue900} style='light'/>
      <ScrollView style={styles.container}>
        <Text style={{ marginTop: 10, fontSize: 20, fontWeight: 'bold'}}>GeoBot</Text>
        <Text style={{ marginBottom: 20, marginTop: 5}}>Ask anything about geography, locations, and etc.</Text>
        <TextInput 
        secureTextEntry={true}
        style={{fontSize: 15, marginBottom: 10, backgroundColor: 'white'}}
        // multiline
        // numberOfLines={5}
        label="Enter your prompt"
        value={prompt}
        onChangeText={text => setPrompt(text)}
        mode='outlined'
        />
        <Button loading={loading} icon="send" style={{borderRadius: 5}} mode='contained' onPress={onSumbitPrompt}>Submit prompt</Button>
      
        <Card  mode='elevated' style={{marginTop: 30, backgroundColor: 'white', marginBottom: 50}}>
          <Card.Title titleStyle={{fontWeight: 'bold'}} title="AI Output:" />
          <Card.Content>
            {
              loading ? (
                <ActivityIndicator></ActivityIndicator>
              )
              : 
              (
                <Text>{aiOutput || "- - -"}</Text>
              )
            }
          </Card.Content>
        </Card>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 40
  },
});
