import React, {useState} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {TouchableOpacity, Text} from 'react-native';

function CustomDateTimepickerModal({
  mode,
  data,
  handleData,
  textFormatter,
  textStyle = {},
}) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    handleData(date);
    hideDatePicker();
  };

  return (
    <>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={mode}
        date={data}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <TouchableOpacity onPress={showDatePicker}>
        <Text style={textStyle}>{textFormatter(data)}</Text>
      </TouchableOpacity>
    </>
  );
}

export default CustomDateTimepickerModal;
