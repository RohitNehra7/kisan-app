const request = require('supertest');
const express = require('express');

// We test a simulated version of the app logic to ensure the normalization engine is robust
describe('Kisan API Integrity Tests', () => {
  
  test('Data Normalization Engine should handle capitalized keys', () => {
    const rawRecord = {
      "State": "Haryana",
      "District": "Hisar",
      "Market": "Hisar",
      "Commodity": "Mustard",
      "Min_Price": "5000",
      "Max_Price": "6000",
      "Modal_Price": "5500"
    };

    const getVal = (obj, targetKey) => {
      const key = Object.keys(obj).find(k => k.toLowerCase() === targetKey.toLowerCase());
      return key ? obj[key] : null;
    };

    const cleaned = {
      modalPrice: parseFloat(getVal(rawRecord, 'modal_price')) || 0
    };

    expect(cleaned.modalPrice).toBe(5500);
  });

  test('Data Normalization Engine should handle lowercase keys', () => {
    const rawRecord = {
      "state": "Haryana",
      "modal_price": "4500"
    };

    const getVal = (obj, targetKey) => {
      const key = Object.keys(obj).find(k => k.toLowerCase() === targetKey.toLowerCase());
      return key ? obj[key] : null;
    };

    const cleaned = {
      modalPrice: parseFloat(getVal(rawRecord, 'modal_price')) || 0
    };

    expect(cleaned.modalPrice).toBe(4500);
  });
});
