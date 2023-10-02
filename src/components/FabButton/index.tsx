import { TouchableOpacity, View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface Props{
    handleOpenCloseModalAdicionarProduto(): void
}

export function FabButton({handleOpenCloseModalAdicionarProduto}:Props){

    return(
        <View style={style.container}>
            <TouchableOpacity onPress={handleOpenCloseModalAdicionarProduto}>
                <View>
                    <AntDesign 
                        name="plus"
                        size={24}
                        color="#FFF"
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        elevation: 5,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 40,
        right: 30,
        backgroundColor: "#7D91FA",
        width: 50,
        height: 50,
        borderRadius: 25
    }
})
