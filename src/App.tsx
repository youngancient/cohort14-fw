import TokenInteractionPage from "./pages/TokenInteractionPage";

const App = () => {
  return (
    <>
      <TokenInteractionPage tokenDetail={{
        name: "Group B Token",
        symbol: "GRP-B",
        decimals: 18,
        totalSupply: "100000000"
      }}/>
    </>
  );
};

export default App;