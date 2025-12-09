"use client";

import { FC } from "react";
import DatePicker from "react-datepicker";

interface DateInputProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

const DateInput: FC<DateInputProps> = ({ selectedDate, setSelectedDate }) => {
  return (
    <div>
      <label className="text-sm mb-2 block">Дата</label>
      <DatePicker
        selected={selectedDate}
        onChange={setSelectedDate}
        placeholderText="ДД.ММ.ГГГГ"
        dateFormat="dd.MM.yyyy"
        className="w-full rounded-md bg-white/10 border border-white/20 text-white px-4 py-2 placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
        calendarClassName="bg-white text-black rounded-lg shadow-lg p-2"
      />
    </div>
  );
};

export default DateInput;
