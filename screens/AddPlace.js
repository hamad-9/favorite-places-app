import PlaceForm from "../components/places/PlaceForm";

/*when using the stack navigator and you go from one screen to another, that new screen is 
simply pushed on top of the old screen 'on top of the stack' but all the other screens for example,
AddPlace screen when going to Map screen is preserved. So, if you then go back to AddPlace screen the 
AddPlace component is not recreated and neither are its nested child components like PlaceForm and
LocationPicker. This cause to the useEffect in LocationPicker is not running again. To solve this problem 
there is another hook call it useIsFocused we must use it in LocationPicker component */
function AddPlace() {
  return <PlaceForm />;
}

export default AddPlace;
