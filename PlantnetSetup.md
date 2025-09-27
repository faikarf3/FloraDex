# Floradex — Teammate Setup & Testing Guide

This doc gets you from zero → running the current Floradex MVP (auth + PlantNet identify tester + scan/upload flow). We’re all using the **same Firebase project**, and the repo already contains the code, rules, and screens — you mainly need the right tooling, env vars, and a dev build.

---

## 1) Prerequisites

- **Node.js 18+** (LTS recommended)
- **Git**
- **Expo tooling**
  - You can use `npx expo` without installing globally
- **Expo account** (sign in during dev client build if prompted)

> You do **not** need to create a Firebase project. We share one.

---

## 2) Clone & install

```bash
git pull   # or git clone <repo> then cd into it
npm install
