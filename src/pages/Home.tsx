import React, { useState } from "react";
import {
  IonSelect,
  IonSelectOption,
  IonInput,
  IonLabel,
  IonItem,
  IonText,
  IonPage,
  IonHeader,
  IonContent,
} from "@ionic/react";
import "./Home.css"; // Ensure this file exists

const MetricSelect = {
  header: "Pilih Metrik",
  message: "Pilih Salah Satu",
  translucent: true,
};

const UnitSelect = {
  header: "Pilih Unit",
  message: "Pilih Salah Satu",
};

const metrics: { [key: string]: string[] } = {
  Panjang: [
    "Kilometer",
    "Hektometer",
    "Dekameter",
    "Desimeter",
    "Centimeter",
    "Millimeter",
  ],
  Massa: [
    "Ton",
    "Hektogram",
    "Dekagram",
    "Gram",
    "Desigram",
    "Centigram",
    "Milligram",
  ],
  Suhu: ["Celcius", "Fahrenheit"],
  Waktu: ["Hari", "Jam", "Menit"],
  "Arus Listrik": ["Ampere", "Milliampere", "Mikroampere"],
  "Jumlah Zat": ["Mol", "Milimol", "Mikromol"],
};

const defaultUnits: { [key: string]: string } = {
  Panjang: "Meter",
  Massa: "Kilogram",
  Suhu: "Kelvin",
  Waktu: "Detik",
  "Arus Listrik": "Ampere",
  "Jumlah Zat": "Mol",
};

const conversionRates: any = {
  Panjang: {
    Meter: {
      Kilometer: 0.001,
      Hektometer: 0.01,
      Dekameter: 0.1,
      Desimeter: 10,
      Centimeter: 100,
      Millimeter: 1000,
    },
  },
  Massa: {
    Kilogram: {
      Ton: 0.001,
      Hektogram: 10,
      Dekagram: 100,
      Gram: 1000,
      Desigram: 10000,
      Centigram: 100000,
      Milligram: 1000000,
    },
  },
  Suhu: {
    Kelvin: {
      Celcius: (x: number) => x - 273.15,
      Fahrenheit: (x: number) => ((x - 273.15) * 9) / 5 + 32,
    },
  },
  Waktu: {
    Detik: { Hari: 1 / 86400, Jam: 1 / 3600, Menit: 1 / 60 },
  },
  "Arus Listrik": {
    Ampere: { Milliampere: 1000, Mikroampere: 1000000 },
  },
  "Jumlah Zat": {
    Mol: { Milimol: 1000, Mikromol: 1000000 },
  },
};

const Home: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [convertedValue, setConvertedValue] = useState<string>("");

  const handleConvert = (value: string) => {
    if (!selectedMetric || !toUnit || value === "") return;

    const fromUnit = defaultUnits[selectedMetric];
    const conversion = conversionRates[selectedMetric][fromUnit][toUnit];
    let result;

    const numericInput = parseFloat(value);

    if (typeof conversion === "function") {
      result = conversion(numericInput);
    } else {
      result = numericInput * conversion;
    }

    setConvertedValue(result + " " + toUnit);
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setInputValue(value);
      handleConvert(value);
    } else {
      setConvertedValue("Invalid input");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <div className="appheader">
          <div className="logo">
            <img src="../assets/Logo.jpeg" alt="logo" />
          </div>
          <div className="name">
            <h2>Metric Converter</h2>
            <p>By Hizkia Polii</p>
          </div>
        </div>
      </IonHeader>
      <IonContent fullscreen>
        <div>
          <div className="body">
            <IonItem>
              <IonSelect
                value={selectedMetric}
                label="Metrik:"
                interfaceOptions={MetricSelect}
                interface="alert"
                placeholder="Pilih Metric"
                onIonChange={(e) => {
                  setSelectedMetric(e.detail.value);
                  setToUnit("");
                  setConvertedValue("");
                }}
              >
                {Object.keys(metrics).map((metric: string) => (
                  <IonSelectOption key={metric} value={metric}>
                    {metric}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel>Dari: </IonLabel>
              <IonText>
                {selectedMetric ? defaultUnits[selectedMetric] : "N/A"}
              </IonText>
            </IonItem>
            <IonItem>
              <IonSelect
                value={toUnit}
                label="Ke:"
                interfaceOptions={UnitSelect}
                interface="popover"
                placeholder="Pilih Salah Satu"
                onIonChange={(e) => setToUnit(e.detail.value)}
                disabled={!selectedMetric}
              >
                {selectedMetric &&
                  metrics[selectedMetric]
                    .filter(
                      (unit: string) => unit !== defaultUnits[selectedMetric]
                    )
                    .map((unit: string) => (
                      <IonSelectOption key={unit} value={unit}>
                        {unit}
                      </IonSelectOption>
                    ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel>Nilai: </IonLabel>
              <IonInput
                value={inputValue}
                placeholder="Masukkan nilai"
                onIonInput={handleInputChange}
                disabled={!selectedMetric || !toUnit}
              />
              <IonLabel slot="end">
                {selectedMetric ? defaultUnits[selectedMetric] : "N/A"}
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>Hasil: </IonLabel>
              <IonText>{convertedValue}</IonText>
            </IonItem>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
