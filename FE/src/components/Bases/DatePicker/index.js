import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.scss';
const DateRangePicker = ({ startDate, endDate, handleDateChange }) => {
  return (
    <DatePicker
      selected={startDate}
      onChange={handleDateChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      inline
    />
  );
};
export default DateRangePicker;
