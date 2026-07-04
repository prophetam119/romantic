import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DateGateConfig } from "../../../shared/types/content";
import { isMatchingDate } from "../../../shared/utils/dateGate";
import "./DateGate.css";

const MONTHS = [
  { value: 1, label: "январь" },
  { value: 2, label: "февраль" },
  { value: 3, label: "март" },
  { value: 4, label: "апрель" },
  { value: 5, label: "май" },
  { value: 6, label: "июнь" },
  { value: 7, label: "июль" },
  { value: 8, label: "август" },
  { value: 9, label: "сентябрь" },
  { value: 10, label: "октябрь" },
  { value: 11, label: "ноябрь" },
  { value: 12, label: "декабрь" },
];

interface DateGateProps {
  config: DateGateConfig;
  correctDate: string;
  onSuccess: () => void;
}

export function DateGate({ config, correctDate, onSuccess }: DateGateProps) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const d = Number(day);
    const m = Number(month);
    const y = Number(year);

    if (!d || !m || !y) {
      setError(true);
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
      return;
    }

    if (isMatchingDate(d, m, y, correctDate)) {
      setError(false);
      setSuccess(true);
      window.setTimeout(onSuccess, 800);
      return;
    }

    setError(true);
    setShake(true);
    window.setTimeout(() => setShake(false), 450);
  };

  const clearError = () => setError(false);

  return (
    <motion.div
      className="gate"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="gate__eyebrow">{config.eyebrow}</span>
      <h1 className="gate__question">{config.question}</h1>
      <p className="gate__hint">{config.hint}</p>

      <motion.form
        className="gate__form"
        onSubmit={handleSubmit}
        animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="gate__row">
          <label className="gate__field">
            <span className="gate__label">день</span>
            <input
              type="number"
              inputMode="numeric"
              className="gate__input"
              min={1}
              max={31}
              value={day}
              onChange={(e) => {
                setDay(e.target.value);
                clearError();
              }}
              disabled={success}
            />
          </label>

          <label className="gate__field gate__field--month">
            <span className="gate__label">месяц</span>
            <select
              className="gate__input gate__select"
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                clearError();
              }}
              disabled={success}
            >
              <option value="" disabled hidden />
              {MONTHS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="gate__field">
            <span className="gate__label">год</span>
            <input
              type="number"
              inputMode="numeric"
              className="gate__input"
              min={2020}
              max={2030}
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                clearError();
              }}
              disabled={success}
            />
          </label>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.p
              key="ok"
              className="gate__feedback gate__feedback--success"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {config.successMessage}
            </motion.p>
          ) : error ? (
            <motion.p
              key="err"
              className="gate__feedback gate__feedback--error"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {!day || !month || !year
                ? "заполни все поля"
                : config.wrongMessage}
            </motion.p>
          ) : (
            <p key="spacer" className="gate__feedback gate__feedback--spacer" />
          )}
        </AnimatePresence>

        <button type="submit" className="gate__submit" disabled={success}>
          {config.submitLabel}
        </button>
      </motion.form>
    </motion.div>
  );
}
