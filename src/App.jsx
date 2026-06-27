import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  Circle,
  Clipboard,
  CreditCard,
  Edit3,
  Plus,
  RefreshCw,
  Share2,
  Sparkles,
  Trash2,
  User,
  X
} from "lucide-react";

const PERSONAL_SPACE_KEY = "creddy:active-space";
const PERSONAL_NAME_KEY = "creddy:user-name";
const SPACE_KEY_PREFIX = "creddy:space:";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CADENCES = ["monthly", "quarterly", "semi-annual", "annual", "perk"];
const ISSUER_ACCENTS = {
  Amex: "#2f80ed",
  Chase: "#1174c9",
  "Capital One": "#c62828",
  Custom: "#334155"
};

const TEMPLATE_CARDS = [
  template("Amex Platinum Card", "Amex", 895, "calendar", [
    benefit("Hotel Credit", 600, "semi-annual", "Up to $300 Jan-Jun and $300 Jul-Dec on eligible prepaid Fine Hotels + Resorts or Hotel Collection bookings."),
    benefit("Digital Entertainment", 300, "monthly", "Up to $25 per month on eligible digital entertainment subscriptions."),
    benefit("Uber Cash", 200, "monthly", "Monthly Uber Cash after adding the card to Uber; December amount may differ."),
    benefit("Airline Fee", 200, "annual", "Incidental airline fee credit after selecting an airline."),
    benefit("CLEAR Plus", 209, "annual", "CLEAR Plus membership statement credit."),
    benefit("Walmart+", 155, "monthly", "Monthly Walmart+ membership credit estimate."),
    benefit("Global Entry/TSA", 0, "perk", "Application fee credit."),
    benefit("Lounge Access", 0, "perk", "Centurion Lounge, Priority Pass Select enrollment, and partner lounge access terms apply.")
  ]),
  template("Amex Gold Card", "Amex", 325, "calendar", [
    benefit("Dining Credit", 120, "monthly", "Up to $10 per month at eligible dining partners after enrollment."),
    benefit("Uber Cash", 120, "monthly", "Up to $10 monthly Uber Cash after adding the card to Uber."),
    benefit("Dunkin' Credit", 84, "monthly", "Up to $7 per month after enrollment."),
    benefit("Resy Credit", 100, "semi-annual", "Up to $50 Jan-Jun and $50 Jul-Dec at eligible Resy restaurants after enrollment.")
  ]),
  template("Amex Green Card", "Amex", 150, "calendar", [
    benefit("CLEAR Plus", 209, "annual", "CLEAR Plus membership statement credit."),
    benefit("LoungeBuddy", 100, "annual", "LoungeBuddy statement credits."),
    benefit("Trip Delay Insurance", 0, "perk", "Coverage terms apply.")
  ]),
  template("Blue Cash Preferred Card", "Amex", 95, "calendar", [
    benefit("Disney Bundle", 84, "monthly", "Up to $7 per month back after spending on an eligible Disney Bundle subscription."),
    benefit("Return Protection", 0, "perk", "Coverage terms apply.")
  ]),
  template("Blue Cash Everyday Card", "Amex", 0, "calendar", [
    benefit("Disney Bundle", 84, "monthly", "Up to $7 per month back after spending on an eligible Disney Bundle subscription."),
    benefit("Home Chef", 180, "monthly", "Up to $15 per month in statement credits on eligible Home Chef purchases.")
  ]),
  template("Delta SkyMiles Blue Amex", "Amex", 0, "calendar", [
    benefit("Delta Pay With Miles", 0, "perk", "Use miles toward Delta flights when eligible."),
    benefit("No Foreign Transaction Fees", 0, "perk", "Useful for international purchases.")
  ]),
  template("Delta SkyMiles Gold Amex", "Amex", 150, "calendar", [
    benefit("Delta Stays", 100, "annual", "Annual Delta Stays statement credit."),
    benefit("Delta Flight Credit", 200, "annual", "Earned after meeting the annual spend requirement."),
    benefit("First Checked Bag", 0, "perk", "First checked bag free on eligible Delta flights.")
  ]),
  template("Delta SkyMiles Platinum Amex", "Amex", 350, "calendar", [
    benefit("Delta Stays", 150, "annual", "Annual Delta Stays statement credit."),
    benefit("Rideshare", 120, "monthly", "Up to $10 per month on eligible U.S. rideshare purchases after enrollment."),
    benefit("Resy", 120, "monthly", "Up to $10 per month at eligible U.S. Resy restaurants after enrollment."),
    benefit("Companion Certificate", 0, "perk", "Annual companion certificate terms apply.")
  ]),
  template("Delta SkyMiles Reserve Amex", "Amex", 650, "calendar", [
    benefit("Delta Stays", 200, "annual", "Annual Delta Stays statement credit."),
    benefit("Rideshare", 120, "monthly", "Up to $10 per month on eligible U.S. rideshare purchases after enrollment."),
    benefit("Resy", 240, "monthly", "Up to $20 per month at eligible U.S. Resy restaurants after enrollment."),
    benefit("Companion Certificate", 0, "perk", "Annual companion certificate terms apply."),
    benefit("Delta Lounge Access", 0, "perk", "Sky Club access terms and visit limits apply.")
  ]),
  template("Hilton Honors Amex", "Amex", 0, "calendar", [
    benefit("Hilton Silver Status", 0, "perk", "Complimentary Hilton Honors Silver status."),
    benefit("No Foreign Transaction Fees", 0, "perk", "Useful for international hotel stays.")
  ]),
  template("Hilton Honors Surpass Amex", "Amex", 150, "calendar", [
    benefit("Hilton Credit", 200, "quarterly", "Up to $50 per quarter at eligible Hilton properties."),
    benefit("Hilton Gold Status", 0, "perk", "Complimentary Hilton Honors Gold status."),
    benefit("Free Night Reward", 0, "perk", "Earn after meeting the annual spend requirement.")
  ]),
  template("Hilton Honors Aspire Amex", "Amex", 550, "calendar", [
    benefit("Hilton Resort Credit", 400, "semi-annual", "Up to $200 Jan-Jun and $200 Jul-Dec at participating Hilton Resorts."),
    benefit("Airline Fee", 200, "quarterly", "Up to $50 per quarter in eligible flight purchases."),
    benefit("CLEAR Plus", 209, "annual", "CLEAR Plus membership statement credit."),
    benefit("Free Night Reward", 0, "perk", "Annual free night reward terms apply."),
    benefit("Hilton Diamond Status", 0, "perk", "Complimentary Hilton Honors Diamond status.")
  ]),
  template("Marriott Bonvoy Bevy Amex", "Amex", 250, "calendar", [
    benefit("Marriott Gold Status", 0, "perk", "Complimentary Marriott Bonvoy Gold Elite status."),
    benefit("Elite Night Credits", 0, "perk", "Automatic elite night credits."),
    benefit("Free Night Award", 0, "perk", "Earn after meeting the annual spend requirement.")
  ]),
  template("Marriott Bonvoy Brilliant Amex", "Amex", 650, "calendar", [
    benefit("Dining Credit", 300, "monthly", "Up to $25 per month at eligible restaurants worldwide."),
    benefit("Free Night Award", 0, "perk", "Annual free night award terms apply."),
    benefit("Marriott Platinum Status", 0, "perk", "Complimentary Marriott Bonvoy Platinum Elite status.")
  ]),
  template("Amex Business Platinum", "Amex", 895, "calendar", [
    benefit("Hotel Credit", 600, "semi-annual", "$300 Jan-Jun and $300 Jul-Dec. Verify enrollment and prepaid Fine Hotels + Resorts/Hotel Collection terms."),
    benefit("Dell", 1150, "annual", "Dell statement credits are spend-threshold based; verify current split and enrollment."),
    benefit("Indeed", 360, "quarterly", "Up to $90 per quarter in statement credits."),
    benefit("Hilton", 200, "quarterly", "Up to $50 per quarter in Hilton purchases."),
    benefit("Wireless", 120, "monthly", "$10 per month wireless statement credit."),
    benefit("Airline Fee", 200, "annual", "Incidental airline fee credit after selecting an airline."),
    benefit("CLEAR Plus", 209, "annual", "Up to $209 CLEAR Plus credit."),
    benefit("ChatGPT Business", 300, "annual", "Verify current Amex offer terms before relying on this."),
    benefit("Adobe", 250, "annual", "Verify current Adobe credit terms before relying on this."),
    benefit("Global Entry/TSA", 0, "perk", "Application fee credit perk."),
    benefit("Cell Phone Protection", 0, "perk", "Coverage terms and deductibles apply.")
  ]),
  template("Amex Business Gold", "Amex", 375, "calendar", [
    benefit("FedEx/Grubhub/Office Supply", 240, "monthly", "$20 per month flexible business credit."),
    benefit("Walmart+", 155, "monthly", "Monthly Walmart+ membership credit estimate."),
    benefit("ChatGPT Business", 300, "annual", "Verify current Amex offer terms before relying on this."),
    benefit("Squarespace", 150, "annual", "Verify current Squarespace credit terms before relying on this."),
    benefit("Cell Phone Protection", 0, "perk", "Coverage terms and deductibles apply.")
  ]),
  template("Graphite Business Cash Unlimited Card", "Amex", 95, "calendar", [
    benefit("Expanded Buying Power", 0, "perk", "Flexible purchasing power terms apply."),
    benefit("Cash Back Rewards", 0, "perk", "Cash-back earning card; no recurring use-it-or-lose-it credit seeded.")
  ]),
  template("Blue Business Cash Card", "Amex", 0, "calendar", [
    benefit("Expanded Buying Power", 0, "perk", "Flexible purchasing power terms apply."),
    benefit("Cash Back Rewards", 0, "perk", "Cash-back earning card; no recurring use-it-or-lose-it credit seeded.")
  ]),
  template("Blue Business Plus Card", "Amex", 0, "calendar", [
    benefit("Expanded Buying Power", 0, "perk", "Flexible purchasing power terms apply."),
    benefit("Membership Rewards", 0, "perk", "Points earning card; no recurring use-it-or-lose-it credit seeded.")
  ]),
  template("Business Green Rewards Card", "Amex", 95, "calendar", [
    benefit("Membership Rewards", 0, "perk", "Points earning card; no recurring use-it-or-lose-it credit seeded."),
    benefit("Expense Management Tools", 0, "perk", "Business tools and employee cards terms apply.")
  ]),
  template("Plum Card", "Amex", 250, "calendar", [
    benefit("Early Pay Discount", 0, "perk", "Discount opportunity depends on payment timing."),
    benefit("No Preset Spending Limit", 0, "perk", "Spending power adjusts with account history and other factors.")
  ]),
  template("Delta SkyMiles Gold Business Amex", "Amex", 150, "calendar", [
    benefit("Delta Stays", 150, "annual", "Annual Delta Stays statement credit."),
    benefit("Delta Flight Credit", 200, "annual", "Earned after meeting the annual spend requirement."),
    benefit("First Checked Bag", 0, "perk", "First checked bag free on eligible Delta flights.")
  ]),
  template("Delta SkyMiles Platinum Business Amex", "Amex", 350, "calendar", [
    benefit("Delta Stays", 200, "annual", "Annual Delta Stays statement credit."),
    benefit("Rideshare", 120, "monthly", "Up to $10 per month on eligible U.S. rideshare purchases after enrollment."),
    benefit("Resy", 120, "monthly", "Up to $10 per month at eligible U.S. Resy restaurants after enrollment."),
    benefit("Companion Certificate", 0, "perk", "Annual companion certificate terms apply.")
  ]),
  template("Delta SkyMiles Reserve Business Amex", "Amex", 650, "calendar", [
    benefit("Delta Stays", 250, "annual", "Annual Delta Stays statement credit."),
    benefit("Rideshare", 120, "monthly", "Up to $10 per month on eligible U.S. rideshare purchases after enrollment."),
    benefit("Resy", 240, "monthly", "Up to $20 per month at eligible U.S. Resy restaurants after enrollment."),
    benefit("Companion Certificate", 0, "perk", "Annual companion certificate terms apply."),
    benefit("Delta Lounge Access", 0, "perk", "Sky Club access terms and visit limits apply.")
  ]),
  template("Marriott Bonvoy Business Amex", "Amex", 125, "calendar", [
    benefit("Free Night Award", 0, "perk", "Annual free night award terms apply."),
    benefit("Marriott Gold Status", 0, "perk", "Complimentary Marriott Bonvoy Gold Elite status."),
    benefit("Elite Night Credits", 0, "perk", "Automatic elite night credits.")
  ]),
  template("Hilton Honors Business Amex", "Amex", 195, "calendar", [
    benefit("Hilton Credit", 240, "quarterly", "Up to $60 per quarter at eligible Hilton properties."),
    benefit("Hilton Gold Status", 0, "perk", "Complimentary Hilton Honors Gold status."),
    benefit("Free Night Reward", 0, "perk", "Earn after meeting the annual spend requirement.")
  ]),
  template("Lowe's Business Rewards Amex", "Amex", 0, "calendar", [
    benefit("Lowe's Benefits", 0, "perk", "Lowe's business offers and purchase benefits vary."),
    benefit("Expense Management Tools", 0, "perk", "Business tools and employee cards terms apply.")
  ]),
  template("Amazon Business Prime Amex", "Amex", 0, "calendar", [
    benefit("Amazon Business Rewards", 0, "perk", "Rewards and payment-term options vary by Prime eligibility."),
    benefit("No Annual Fee", 0, "perk", "No annual fee card.")
  ]),
  template("Amazon Business Amex", "Amex", 0, "calendar", [
    benefit("Amazon Business Rewards", 0, "perk", "Rewards and payment-term options vary."),
    benefit("No Annual Fee", 0, "perk", "No annual fee card.")
  ]),
  template("Chase Sapphire Preferred", "Chase", 95, "anniversary", [
    benefit("Chase Travel Hotel Credit", 50, "annual", "Annual hotel credit for eligible hotel bookings through Chase Travel."),
    benefit("DashPass", 0, "perk", "Complimentary DashPass benefit terms apply."),
    benefit("Trip Protections", 0, "perk", "Trip cancellation/interruption and related protections terms apply.")
  ]),
  template("Chase Sapphire Reserve", "Chase", 795, "anniversary", [
    benefit("Travel Credit", 300, "annual", "Annual travel credit."),
    benefit("The Edit Credit", 500, "semi-annual", "Up to $250 Jan-Jun and $250 Jul-Dec for eligible The Edit bookings through Chase Travel."),
    benefit("Apple TV+ and Apple Music", 250, "annual", "Promotional subscription benefit; verify current eligibility window."),
    benefit("DoorDash Benefits", 300, "monthly", "DoorDash credits/promos are split by benefit type; verify current monthly terms."),
    benefit("Priority Pass", 0, "perk", "Priority Pass Select membership terms apply."),
    benefit("Global Entry/TSA/NEXUS", 0, "perk", "Application fee credit terms apply.")
  ]),
  template("Chase Freedom Unlimited", "Chase", 0, "calendar", [
    benefit("DashPass", 0, "perk", "Complimentary DashPass benefit terms apply."),
    benefit("Cash Back Rewards", 0, "perk", "Cash-back earning card; no recurring use-it-or-lose-it credit seeded.")
  ]),
  template("Chase Freedom Flex", "Chase", 0, "calendar", [
    benefit("DashPass", 0, "perk", "Complimentary DashPass benefit terms apply."),
    benefit("Quarterly Bonus Categories", 0, "perk", "Activate quarterly bonus categories when applicable.")
  ]),
  template("Chase Freedom Rise", "Chase", 0, "calendar", [
    benefit("Cash Back Rewards", 0, "perk", "Starter cash-back card; no recurring use-it-or-lose-it credit seeded.")
  ]),
  template("Ink Business Unlimited", "Chase", 0, "anniversary", [
    benefit("Cash Back Rewards", 0, "perk", "Business cash-back earning card; no recurring use-it-or-lose-it credit seeded."),
    benefit("Employee Cards", 0, "perk", "Employee cards at no additional cost.")
  ]),
  template("Ink Business Cash", "Chase", 0, "anniversary", [
    benefit("Cash Back Rewards", 0, "perk", "Business cash-back earning card; no recurring use-it-or-lose-it credit seeded."),
    benefit("Employee Cards", 0, "perk", "Employee cards at no additional cost.")
  ]),
  template("Ink Business Preferred", "Chase", 95, "anniversary", [
    benefit("Cell Phone Protection", 0, "perk", "Pay the phone bill with the card; coverage terms apply."),
    benefit("No Foreign Transaction Fees", 0, "perk", "Useful for international spend."),
    benefit("Points Earner", 0, "perk", "No use-it-or-lose-it recurring credits seeded.")
  ]),
  template("Ink Business Premier", "Chase", 195, "anniversary", [
    benefit("5% Lyft", 0, "perk", "5% total cash back on Lyft rides through Sep 2027 per request; verify current terms."),
    benefit("Cell Phone Protection", 0, "perk", "Pay the phone bill with the card; coverage terms apply."),
    benefit("No Foreign Transaction Fees", 0, "perk", "Useful for international spend.")
  ]),
  template("Sapphire Reserve for Business", "Chase", 795, "anniversary", [
    benefit("Travel Credit", 300, "annual", "Annual travel credit."),
    benefit("The Edit Credit", 500, "semi-annual", "Up to $250 Jan-Jun and $250 Jul-Dec for eligible The Edit bookings through Chase Travel."),
    benefit("Business Services Credits", 400, "annual", "Business service credits vary by partner and enrollment; verify current split."),
    benefit("Priority Pass", 0, "perk", "Priority Pass Select membership terms apply."),
    benefit("Global Entry/TSA/NEXUS", 0, "perk", "Application fee credit terms apply.")
  ]),
  template("United Gateway Card", "Chase", 0, "anniversary", [
    benefit("United Benefits", 0, "perk", "United card travel and purchase benefits vary."),
    benefit("No Annual Fee", 0, "perk", "No annual fee card.")
  ]),
  template("United Explorer Card", "Chase", 150, "anniversary", [
    benefit("United Hotels Credit", 100, "annual", "Annual United Hotels credit; verify current booking terms."),
    benefit("United Club Passes", 0, "perk", "Two one-time United Club passes each account anniversary."),
    benefit("First Checked Bag", 0, "perk", "First checked bag free on eligible United flights.")
  ]),
  template("United Quest Card", "Chase", 350, "anniversary", [
    benefit("United Credit", 200, "annual", "Annual United purchase credit."),
    benefit("United Hotels Credit", 150, "annual", "Annual United Hotels credit; verify current booking terms."),
    benefit("Award Flight Credits", 0, "perk", "Award flight credit benefit terms apply."),
    benefit("Checked Bags", 0, "perk", "Checked bag benefits apply on eligible United flights.")
  ]),
  template("United Club Card", "Chase", 695, "anniversary", [
    benefit("United Hotels Credit", 200, "annual", "Annual United Hotels credit; verify current booking terms."),
    benefit("United Club Membership", 0, "perk", "United Club membership terms apply."),
    benefit("Checked Bags", 0, "perk", "Checked bag benefits apply on eligible United flights.")
  ]),
  template("United Business Card", "Chase", 150, "anniversary", [
    benefit("United Credit", 125, "annual", "Annual United travel credit; verify current terms."),
    benefit("United Club Passes", 0, "perk", "Two one-time United Club passes each account anniversary."),
    benefit("First Checked Bag", 0, "perk", "First checked bag free on eligible United flights.")
  ]),
  template("United Club Business Card", "Chase", 695, "anniversary", [
    benefit("United Club Membership", 0, "perk", "United Club membership terms apply."),
    benefit("Checked Bags", 0, "perk", "Checked bag benefits apply on eligible United flights."),
    benefit("Premier Access", 0, "perk", "Premier Access travel benefit terms apply.")
  ]),
  template("Southwest Rapid Rewards Plus", "Chase", 99, "anniversary", [
    benefit("Anniversary Points", 0, "perk", "Anniversary points post each account year."),
    benefit("EarlyBird Credits", 0, "perk", "EarlyBird Check-In benefit terms apply.")
  ]),
  template("Southwest Rapid Rewards Premier", "Chase", 149, "anniversary", [
    benefit("Anniversary Points", 0, "perk", "Anniversary points post each account year."),
    benefit("EarlyBird Credits", 0, "perk", "EarlyBird Check-In benefit terms apply."),
    benefit("No Foreign Transaction Fees", 0, "perk", "Useful for international spend.")
  ]),
  template("Southwest Rapid Rewards Priority", "Chase", 229, "anniversary", [
    benefit("Southwest Travel Credit", 75, "annual", "Annual Southwest travel credit."),
    benefit("Upgraded Boardings", 0, "perk", "Four upgraded boardings per year when available."),
    benefit("Anniversary Points", 0, "perk", "Anniversary points post each account year.")
  ]),
  template("Southwest Premier Business", "Chase", 149, "anniversary", [
    benefit("Anniversary Points", 0, "perk", "Anniversary points post each account year."),
    benefit("EarlyBird Credits", 0, "perk", "EarlyBird Check-In benefit terms apply.")
  ]),
  template("Southwest Performance Business", "Chase", 299, "anniversary", [
    benefit("Global Entry/TSA/NEXUS", 0, "perk", "Application fee credit terms apply."),
    benefit("Upgraded Boardings", 0, "perk", "Four upgraded boardings per year when available."),
    benefit("Inflight Wi-Fi Credits", 0, "perk", "Inflight Wi-Fi credit terms apply.")
  ]),
  template("Marriott Bonvoy Bold", "Chase", 0, "anniversary", [
    benefit("Marriott Silver Status", 0, "perk", "Complimentary Marriott Bonvoy Silver Elite status."),
    benefit("Elite Night Credits", 0, "perk", "Automatic elite night credits.")
  ]),
  template("Marriott Bonvoy Boundless", "Chase", 95, "anniversary", [
    benefit("Free Night Award", 0, "perk", "Annual free night award terms apply."),
    benefit("Marriott Silver Status", 0, "perk", "Complimentary Marriott Bonvoy Silver Elite status."),
    benefit("Elite Night Credits", 0, "perk", "Automatic elite night credits.")
  ]),
  template("Marriott Bonvoy Bountiful", "Chase", 250, "anniversary", [
    benefit("Marriott Gold Status", 0, "perk", "Complimentary Marriott Bonvoy Gold Elite status."),
    benefit("Elite Night Credits", 0, "perk", "Automatic elite night credits."),
    benefit("Free Night Award", 0, "perk", "Earn after meeting the annual spend requirement.")
  ]),
  template("IHG One Rewards Traveler", "Chase", 0, "anniversary", [
    benefit("IHG Silver Status", 0, "perk", "Complimentary IHG One Rewards Silver Elite status."),
    benefit("Fourth Reward Night", 0, "perk", "Fourth night reward benefit terms apply.")
  ]),
  template("IHG One Rewards Premier", "Chase", 99, "anniversary", [
    benefit("United TravelBank", 50, "annual", "Annual United TravelBank cash benefit; verify registration terms."),
    benefit("Anniversary Free Night", 0, "perk", "Annual free night certificate terms apply."),
    benefit("Global Entry/TSA/NEXUS", 0, "perk", "Application fee credit terms apply."),
    benefit("IHG Platinum Status", 0, "perk", "Complimentary IHG One Rewards Platinum Elite status.")
  ]),
  template("IHG One Rewards Premier Business", "Chase", 99, "anniversary", [
    benefit("United TravelBank", 50, "annual", "Annual United TravelBank cash benefit; verify registration terms."),
    benefit("Anniversary Free Night", 0, "perk", "Annual free night certificate terms apply."),
    benefit("Global Entry/TSA/NEXUS", 0, "perk", "Application fee credit terms apply."),
    benefit("IHG Platinum Status", 0, "perk", "Complimentary IHG One Rewards Platinum Elite status.")
  ]),
  template("World of Hyatt Card", "Chase", 95, "anniversary", [
    benefit("Free Night Award", 0, "perk", "Annual Category 1-4 free night terms apply."),
    benefit("Hyatt Discoverist Status", 0, "perk", "Complimentary World of Hyatt Discoverist status."),
    benefit("Elite Night Credits", 0, "perk", "Automatic elite night credits.")
  ]),
  template("World of Hyatt Business Card", "Chase", 199, "anniversary", [
    benefit("Hyatt Credit", 100, "semi-annual", "Up to $50 twice each year in Hyatt statement credits."),
    benefit("Hyatt Discoverist Status", 0, "perk", "Complimentary World of Hyatt Discoverist status."),
    benefit("Elite Night Credits", 0, "perk", "Earn elite night credits through spend.")
  ]),
  template("Aeroplan Card", "Chase", 95, "anniversary", [
    benefit("Global Entry/TSA/NEXUS", 0, "perk", "Application fee credit terms apply."),
    benefit("First Checked Bag", 0, "perk", "First checked bag free on eligible Air Canada itineraries."),
    benefit("Aeroplan Status", 0, "perk", "Automatic status benefit terms apply.")
  ]),
  template("Disney Inspire Visa", "Chase", 0, "anniversary", [
    benefit("Disney Perks", 0, "perk", "Disney shopping, dining, photo, and vacation financing perks vary."),
    benefit("No Annual Fee", 0, "perk", "No annual fee card.")
  ]),
  template("Disney Premier Visa", "Chase", 49, "anniversary", [
    benefit("Disney Perks", 0, "perk", "Disney shopping, dining, photo, and vacation financing perks vary."),
    benefit("Disney Rewards", 0, "perk", "Earn Disney Rewards Dollars on eligible purchases.")
  ]),
  template("Disney Visa", "Chase", 0, "anniversary", [
    benefit("Disney Perks", 0, "perk", "Disney shopping, dining, photo, and vacation financing perks vary."),
    benefit("No Annual Fee", 0, "perk", "No annual fee card.")
  ]),
  template("Prime Visa", "Chase", 0, "calendar", [
    benefit("Amazon Rewards", 0, "perk", "Rewards rate depends on eligible Prime membership."),
    benefit("No Annual Fee", 0, "perk", "No annual fee card.")
  ]),
  template("Amazon Visa", "Chase", 0, "calendar", [
    benefit("Amazon Rewards", 0, "perk", "Amazon rewards card; no recurring use-it-or-lose-it credit seeded."),
    benefit("No Annual Fee", 0, "perk", "No annual fee card.")
  ]),
  template("Capital One Spark Cash Plus", "Capital One", 150, "anniversary", [
    benefit("Annual Fee Refund", 150, "annual", "Refunded if you spend $150k in the cardholder year."),
    benefit("5% hotels/cars", 0, "perk", "Via Capital One Travel."),
    benefit("No FX fees", 0, "perk", "Useful for international spend.")
  ], "Existing starter template kept from the first release.")
];

const STARTER_CARD_NAMES = new Set([
  "Amex Business Platinum",
  "Amex Business Gold",
  "Ink Business Preferred",
  "Ink Business Premier",
  "Capital One Spark Cash Plus"
]);

function benefit(name, value, cadence, note) {
  return { id: uid("benefit"), name, value, cadence, note, verify: false };
}

function template(name, issuer, annualFee, resetType, benefits, sourceNote = "Research snapshot from issuer catalogs on June 27, 2026. Verify current terms before relying on amounts.") {
  return { name, issuer, annualFee, resetType, resetDate: "", sourceNote, benefits };
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

function cloneTemplate(template, suffix = "") {
  return {
    id: uid("card"),
    name: suffix ? `${template.name} ${suffix}` : template.name,
    issuer: template.issuer,
    annualFee: template.annualFee,
    resetType: template.resetType,
    resetDate: template.resetDate,
    sourceNote: template.sourceNote,
    benefits: template.benefits.map((item) => ({ ...item, id: uid("benefit") }))
  };
}

function seedCards() {
  return TEMPLATE_CARDS.filter((template) => STARTER_CARD_NAMES.has(template.name)).map((template) => cloneTemplate(template));
}

function randomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function periodCount(cadence) {
  if (cadence === "monthly") return 12;
  if (cadence === "quarterly") return 4;
  if (cadence === "semi-annual") return 2;
  if (cadence === "annual") return 1;
  return 0;
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function shortDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function nowStamp(value) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function anniversaryCycle(card, today) {
  if (card.resetType !== "anniversary" || !card.resetDate) return null;
  const [, monthRaw, dayRaw] = card.resetDate.split("-");
  const month = Number(monthRaw) - 1;
  const day = Number(dayRaw);
  if (!Number.isFinite(month) || !Number.isFinite(day)) return null;
  const year = today.getFullYear();
  let start = new Date(year, month, day);
  if (today < start) start = new Date(year - 1, month, day);
  const end = new Date(start.getFullYear() + 1, month, day);
  return { start, end };
}

function annualPeriod(card, today) {
  const cycle = anniversaryCycle(card, today);
  if (card.resetType === "anniversary" && !cycle) return null;
  const start = cycle?.start || new Date(today.getFullYear(), 0, 1);
  const end = cycle?.end || new Date(today.getFullYear() + 1, 0, 1);
  return {
    id: `annual:${card.id}:${start.toISOString().slice(0, 10)}`,
    label: `${start.getFullYear()}`,
    fullLabel: `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${new Date(end.getTime() - 86400000).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`,
    renews: end
  };
}

function periodsFor(card, cadence, today = new Date()) {
  const year = today.getFullYear();
  if (cadence === "monthly") {
    return MONTHS.map((label, index) => ({
      id: `month:${year}:${index + 1}`,
      label,
      fullLabel: `${label} ${year}`,
      isCurrent: index === today.getMonth()
    }));
  }
  if (cadence === "quarterly") {
    return [0, 1, 2, 3].map((quarter) => ({
      id: `quarter:${year}:${quarter + 1}`,
      label: `Q${quarter + 1}`,
      fullLabel: `Q${quarter + 1} ${year}`,
      isCurrent: Math.floor(today.getMonth() / 3) === quarter
    }));
  }
  if (cadence === "semi-annual") {
    return [0, 1].map((half) => ({
      id: `half:${year}:${half + 1}`,
      label: half === 0 ? "H1" : "H2",
      fullLabel: half === 0 ? `Jan-Jun ${year}` : `Jul-Dec ${year}`,
      isCurrent: (today.getMonth() < 6 ? 0 : 1) === half
    }));
  }
  if (cadence === "annual") {
    const period = annualPeriod(card, today);
    return period ? [{ ...period, isCurrent: true }] : [];
  }
  return [];
}

function currentPeriod(card, cadence, today = new Date()) {
  return periodsFor(card, cadence, today).find((period) => period.isCurrent) || null;
}

function checkKey(cardId, benefitId, periodId) {
  return `${cardId}:${benefitId}:${periodId}`;
}

function perPeriodValue(benefitItem) {
  const count = periodCount(benefitItem.cadence);
  return count ? Number(benefitItem.value || 0) / count : 0;
}

function normalizeStored(value) {
  if (value == null) return null;
  const raw = typeof value === "object" && "value" in value ? value.value : value;
  if (raw == null || raw === "") return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
}

function timeout(ms) {
  return new Promise((_, reject) => window.setTimeout(() => reject(new Error("storage timeout")), ms));
}

async function readStorage(key, shared) {
  try {
    const bridge = window.storage;
    if (!bridge) return null;
    const read = bridge.get
      ? bridge.get(key, { shared })
      : bridge.getItem
        ? bridge.getItem(key, { shared })
        : Promise.resolve(null);
    return normalizeStored(await Promise.race([Promise.resolve(read), timeout(1500)]));
  } catch {
    return null;
  }
}

async function writeStorage(key, value, shared) {
  try {
    const bridge = window.storage;
    if (!bridge) return;
    const payload = typeof value === "string" ? value : JSON.stringify(value);
    const write = bridge.set
      ? bridge.set(key, payload, { shared })
      : bridge.setItem
        ? bridge.setItem(key, payload, { shared })
        : Promise.resolve();
    await Promise.race([Promise.resolve(write), timeout(1500)]);
  } catch {
    // Storage is optional in local dev and flaky bridges should never break the app.
  }
}

function classNames(...items) {
  return items.filter(Boolean).join(" ");
}

function defaultDraft() {
  return {
    id: uid("card"),
    name: "",
    issuer: "Custom",
    annualFee: 0,
    resetType: "calendar",
    resetDate: "",
    sourceNote: "",
    benefits: [benefit("", 0, "monthly", "")]
  };
}

export default function App() {
  const seeded = useRef(seedCards());
  const [cards, setCards] = useState(seeded.current);
  const [checkoffs, setCheckoffs] = useState({});
  const [activeSpace, setActiveSpace] = useState("");
  const [userName, setUserName] = useState("Me");
  const [spaceLoaded, setSpaceLoaded] = useState(false);
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [spaceInput, setSpaceInput] = useState("");
  const [view, setView] = useState("todo");
  const [expanded, setExpanded] = useState(() => new Set());
  const [editor, setEditor] = useState(null);
  const [addMode, setAddMode] = useState("template");
  const [templateIndex, setTemplateIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [aiState, setAiState] = useState({ status: "idle", message: "" });
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    let cancelled = false;
    async function hydratePersonal() {
      const [space, name] = await Promise.all([
        readStorage(PERSONAL_SPACE_KEY, false),
        readStorage(PERSONAL_NAME_KEY, false)
      ]);
      if (cancelled) return;
      if (typeof name === "string" && name.trim()) setUserName(name.trim());
      if (typeof space === "string" && space.trim()) {
        setActiveSpace(space.trim().toUpperCase());
      } else {
        setShowSpaceModal(true);
        setSpaceLoaded(true);
      }
    }
    hydratePersonal();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activeSpace) return;
    let cancelled = false;
    async function hydrateSpace() {
      setSpaceLoaded(false);
      await writeStorage(PERSONAL_SPACE_KEY, activeSpace, false);
      const stored = await readStorage(`${SPACE_KEY_PREFIX}${activeSpace}`, true);
      if (cancelled) return;
      if (stored?.cards && stored?.checkoffs) {
        setCards(stored.cards);
        setCheckoffs(stored.checkoffs);
      } else {
        setCards(seedCards());
        setCheckoffs({});
      }
      setSpaceLoaded(true);
    }
    hydrateSpace();
    return () => {
      cancelled = true;
    };
  }, [activeSpace]);

  useEffect(() => {
    if (!activeSpace || !spaceLoaded) return;
    writeStorage(`${SPACE_KEY_PREFIX}${activeSpace}`, { cards, checkoffs, updatedAt: new Date().toISOString() }, true);
  }, [activeSpace, cards, checkoffs, spaceLoaded]);

  useEffect(() => {
    writeStorage(PERSONAL_NAME_KEY, userName, false);
  }, [userName]);

  const allItems = useMemo(() => buildItems(cards, checkoffs, today), [cards, checkoffs, today]);
  const currentOpen = allItems.filter((item) => item.isCurrent && !item.checked);
  const currentDone = allItems.filter((item) => item.isCurrent && item.checked);
  const stats = useMemo(() => buildStats(cards, checkoffs, today), [cards, checkoffs, today]);

  function toggleCheck(item) {
    setCheckoffs((current) => {
      const next = { ...current };
      if (next[item.key]) {
        delete next[item.key];
      } else {
        next[item.key] = { by: userName.trim() || "Someone", at: new Date().toISOString() };
      }
      return next;
    });
  }

  function saveEditor() {
    const clean = cleanCard(editor?.card);
    if (!clean) return;
    setCards((current) => {
      if (editor.mode === "edit") return current.map((card) => (card.id === clean.id ? clean : card));
      return [clean, ...current];
    });
    setEditor(null);
    setAiState({ status: "idle", message: "" });
  }

  function addFromTemplate() {
    const template = TEMPLATE_CARDS[templateIndex];
    const count = Math.max(1, Math.min(25, Number(quantity) || 1));
    const copies = Array.from({ length: count }, (_, index) => cloneTemplate(template, count > 1 ? `#${index + 1}` : ""));
    setCards((current) => [...copies, ...current]);
    setEditor(null);
  }

  function deleteCard(cardId) {
    setCards((current) => current.filter((card) => card.id !== cardId));
    setCheckoffs((current) => {
      const next = {};
      Object.entries(current).forEach(([key, value]) => {
        if (!key.startsWith(`${cardId}:`)) next[key] = value;
      });
      return next;
    });
  }

  function startSpace(code) {
    const next = code.trim().toUpperCase() || randomCode();
    setActiveSpace(next);
    setShowSpaceModal(false);
  }

  function copySpace() {
    if (!activeSpace) return;
    navigator.clipboard?.writeText(activeSpace);
  }

  return (
    <div className="min-h-screen text-slate-950" style={{ background: "linear-gradient(145deg,#f8fafc 0%,#eef1f5 48%,#e4e8ef 100%)" }}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <Header
          activeSpace={activeSpace}
          userName={userName}
          setUserName={setUserName}
          onAdd={() => {
            setAddMode("template");
            setEditor({ mode: "add", card: defaultDraft() });
          }}
          onSpace={() => setShowSpaceModal(true)}
        />
        <Hero stats={stats} currentOpen={currentOpen.length} spaceLoaded={spaceLoaded} />
        <div className="grid gap-5 lg:grid-cols-3">
          <main className="lg:col-span-2">
            <Segmented value={view} onChange={setView} />
            {view === "todo" ? (
              <TodoView items={currentOpen} done={currentDone} onToggle={toggleCheck} />
            ) : (
              <AllCardsView
                cards={cards}
                checkoffs={checkoffs}
                expanded={expanded}
                setExpanded={setExpanded}
                today={today}
                onToggle={toggleCheck}
                onEdit={(card) => setEditor({ mode: "edit", card: structuredClone(card) })}
                onDelete={deleteCard}
              />
            )}
          </main>
          <aside className="flex flex-col gap-5">
            <SharePanel activeSpace={activeSpace} onCopy={copySpace} onSwitch={() => setShowSpaceModal(true)} />
            <Nudges cards={cards} onEdit={(card) => setEditor({ mode: "edit", card: structuredClone(card) })} />
            <TemplatePanel onUse={(index) => {
              setTemplateIndex(index);
              setAddMode("template");
              setEditor({ mode: "add", card: defaultDraft() });
            }} />
          </aside>
        </div>
      </div>

      {showSpaceModal && (
        <SpaceModal
          activeSpace={activeSpace}
          input={spaceInput}
          setInput={setSpaceInput}
          onCreate={() => startSpace("")}
          onJoin={() => startSpace(spaceInput)}
          onClose={() => {
            if (activeSpace) setShowSpaceModal(false);
          }}
        />
      )}

      {editor && (
        <CardEditor
          editor={editor}
          setEditor={setEditor}
          addMode={addMode}
          setAddMode={setAddMode}
          templateIndex={templateIndex}
          setTemplateIndex={setTemplateIndex}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddTemplate={addFromTemplate}
          onSave={saveEditor}
          aiState={aiState}
          onResearch={() => researchBenefits(editor, setEditor, setAiState)}
          onClose={() => {
            setEditor(null);
            setAiState({ status: "idle", message: "" });
          }}
        />
      )}
    </div>
  );
}

function buildItems(cards, checkoffs, today) {
  return cards.flatMap((card) =>
    card.benefits.flatMap((item) => {
      if (item.cadence === "perk") return [];
      const period = currentPeriod(card, item.cadence, today);
      if (!period) return [];
      const key = checkKey(card.id, item.id, period.id);
      return [{
        key,
        card,
        benefit: item,
        period,
        value: perPeriodValue(item),
        checked: Boolean(checkoffs[key]),
        checkoff: checkoffs[key],
        isCurrent: true
      }];
    })
  ).sort((a, b) => b.value - a.value);
}

function buildStats(cards, checkoffs, today) {
  let available = 0;
  let captured = 0;
  let potential = 0;
  let fees = 0;

  cards.forEach((card) => {
    fees += Number(card.annualFee || 0);
    card.benefits.forEach((item) => {
      if (item.cadence === "perk") return;
      potential += Number(item.value || 0);
      const periods = periodsFor(card, item.cadence, today);
      periods.forEach((period) => {
        const key = checkKey(card.id, item.id, period.id);
        if (checkoffs[key]) captured += perPeriodValue(item);
        if (period.isCurrent && !checkoffs[key]) available += perPeriodValue(item);
      });
    });
  });

  return {
    available,
    captured,
    potential,
    fees,
    net: captured - fees,
    progress: potential ? Math.min(100, Math.round((captured / potential) * 100)) : 0
  };
}

function Header({ activeSpace, userName, setUserName, onAdd, onSpace }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg" style={{ background: "linear-gradient(135deg,#111827,#334155)" }}>
          <CreditCard size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Creddy</h1>
          <p className="text-sm text-slate-500">Shared benefit checklist for every physical card.</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex min-h-11 items-center gap-2 rounded-2xl border border-white bg-white px-3 text-sm shadow-sm">
          <User size={16} className="text-slate-500" />
          <input
            className="w-24 bg-transparent outline-none"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            aria-label="Your name"
          />
        </label>
        <button className="flex min-h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium shadow-sm" onClick={onSpace}>
          <Share2 size={17} />
          {activeSpace || "Space"}
        </button>
        <button className="flex min-h-11 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm" onClick={onAdd}>
          <Plus size={17} />
          Add card
        </button>
      </div>
    </header>
  );
}

function Hero({ stats, currentOpen, spaceLoaded }) {
  return (
    <section className="overflow-hidden rounded-2xl p-5 text-white shadow-2xl sm:p-6" style={{ background: "linear-gradient(135deg,#09090b 0%,#20242c 50%,#475569 100%)" }}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-slate-300">Available to claim now</p>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <strong className="text-5xl font-semibold tracking-tight sm:text-6xl">{money(stats.available)}</strong>
            <span className="mb-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-950">{currentOpen} open</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-96">
          <HeroStat label="Captured this year" value={money(stats.captured)} />
          <HeroStat label="Annual potential" value={money(stats.potential)} />
          <HeroStat label="Annual fees" value={money(stats.fees)} />
          <HeroStat label="Net captured" value={money(stats.net)} tone={stats.net >= 0 ? "good" : "bad"} />
        </div>
      </div>
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
          <span>{spaceLoaded ? "Space synced" : "Using instant seed while storage hydrates"}</span>
          <span>{stats.progress}% captured</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-700">
          <div className="h-full rounded-full bg-white" style={{ width: `${stats.progress}%` }} />
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value, tone }) {
  const color = tone === "good" ? "text-emerald-300" : tone === "bad" ? "text-rose-300" : "text-white";
  return (
    <div className="rounded-2xl border border-slate-600 p-3" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
      <p className="text-xs text-slate-300">{label}</p>
      <p className={classNames("mt-1 text-lg font-semibold", color)}>{value}</p>
    </div>
  );
}

function Segmented({ value, onChange }) {
  return (
    <div className="mb-4 grid grid-cols-2 rounded-2xl bg-slate-200 p-1">
      {["todo", "cards"].map((item) => (
        <button
          key={item}
          className={classNames("min-h-11 rounded-xl text-sm font-semibold transition", value === item ? "bg-white text-slate-950 shadow-sm" : "text-slate-500")}
          onClick={() => onChange(item)}
        >
          {item === "todo" ? "To-Do" : "All Cards"}
        </button>
      ))}
    </div>
  );
}

function TodoView({ items, done, onToggle }) {
  return (
    <div className="flex flex-col gap-4">
      <GroupedList title="Claim now" empty="Nothing due in the current period.">
        {items.map((item) => <TodoRow key={item.key} item={item} onToggle={() => onToggle(item)} />)}
      </GroupedList>
      <GroupedList title="Done this period" empty="Checked items will land here with who and when.">
        {done.map((item) => <TodoRow key={item.key} item={item} onToggle={() => onToggle(item)} done />)}
      </GroupedList>
    </div>
  );
}

function GroupedList({ title, empty, children }) {
  const list = React.Children.toArray(children);
  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-500">{title}</h2>
      </div>
      {list.length ? <div className="divide-y divide-slate-100">{list}</div> : <p className="px-4 py-8 text-center text-sm text-slate-400">{empty}</p>}
    </section>
  );
}

function TodoRow({ item, onToggle, done }) {
  return (
    <button className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50" onClick={onToggle}>
      <span className={classNames("flex h-8 w-8 shrink-0 items-center justify-center rounded-full border", done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 text-slate-300")}>
        {done ? <Check size={18} /> : <Circle size={18} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-semibold">{item.benefit.name}</span>
        <span className="mt-1 flex flex-wrap gap-2 text-sm text-slate-500">
          <span>{item.card.name}</span>
          <span>{item.period.fullLabel}</span>
          {done && item.checkoff ? <span>by {item.checkoff.by} at {nowStamp(item.checkoff.at)}</span> : null}
        </span>
      </span>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">{money(item.value)}</span>
    </button>
  );
}

function AllCardsView({ cards, checkoffs, expanded, setExpanded, today, onToggle, onEdit, onDelete }) {
  return (
    <div className="flex flex-col gap-3">
      {cards.map((card) => {
        const isExpanded = expanded.has(card.id);
        return (
          <section key={card.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="flex items-center gap-3 px-4 py-4">
              <button
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white"
                style={{ backgroundColor: ISSUER_ACCENTS[card.issuer] || ISSUER_ACCENTS.Custom }}
                onClick={() => toggleExpanded(card.id, expanded, setExpanded)}
                aria-label={`Expand ${card.name}`}
              >
                <ChevronDown size={20} className={classNames("transition", isExpanded ? "rotate-180" : "")} />
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-semibold">{card.name}</h2>
                <p className="text-sm text-slate-500">{card.issuer} - {money(card.annualFee)} annual fee - {card.resetType === "calendar" ? "Calendar year reset" : card.resetDate ? `Anniversary ${shortDate(card.resetDate)}` : "Set reset date"}</p>
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600" onClick={() => onEdit(card)} aria-label={`Edit ${card.name}`}>
                <Edit3 size={17} />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600" onClick={() => onDelete(card.id)} aria-label={`Delete ${card.name}`}>
                <Trash2 size={17} />
              </button>
            </div>
            {isExpanded && (
              <div className="border-t border-slate-100 px-4 pb-4">
                {card.sourceNote ? <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{card.sourceNote}</p> : null}
                <div className="mt-3 flex flex-col gap-3">
                  {card.benefits.map((item) => (
                    <BenefitGrid
                      key={item.id}
                      card={card}
                      benefitItem={item}
                      checkoffs={checkoffs}
                      today={today}
                      onToggle={onToggle}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function toggleExpanded(cardId, expanded, setExpanded) {
  const next = new Set(expanded);
  if (next.has(cardId)) next.delete(cardId);
  else next.add(cardId);
  setExpanded(next);
}

function BenefitGrid({ card, benefitItem, checkoffs, today, onToggle }) {
  const periods = periodsFor(card, benefitItem.cadence, today);
  const used = periods.filter((period) => checkoffs[checkKey(card.id, benefitItem.id, period.id)]).length;
  const count = periodCount(benefitItem.cadence);
  const annual = benefitItem.cadence === "annual" ? annualPeriod(card, today) : null;

  if (benefitItem.cadence === "perk") {
    return (
      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">{benefitItem.name}</h3>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">Perk</span>
        </div>
        <p className="mt-2 text-sm text-slate-500">{benefitItem.note}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{benefitItem.name}</h3>
            {benefitItem.verify ? <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">verify</span> : null}
          </div>
          <p className="mt-1 text-sm text-slate-500">{benefitItem.note}</p>
          {annual?.renews ? <p className="mt-1 text-xs font-semibold text-slate-400">renews {shortDate(annual.renews)}</p> : null}
          {!periods.length ? <p className="mt-2 text-sm font-semibold text-amber-700">Set this card's reset date to track annual benefits.</p> : null}
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{money(benefitItem.value)}</p>
          <p className="text-xs text-slate-500">used {used}/{count}</p>
        </div>
      </div>
      {periods.length ? (
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
          {periods.map((period) => {
            const key = checkKey(card.id, benefitItem.id, period.id);
            const checked = Boolean(checkoffs[key]);
            const item = { key, card, benefit: benefitItem, period, value: perPeriodValue(benefitItem), checked, checkoff: checkoffs[key], isCurrent: period.isCurrent };
            return (
              <button
                key={period.id}
                className={classNames(
                  "min-h-12 rounded-xl border px-2 text-sm font-semibold transition",
                  checked ? "border-emerald-500 bg-emerald-500 text-white" : period.isCurrent ? "border-slate-950 bg-white text-slate-950" : "border-slate-200 bg-white text-slate-500"
                )}
                onClick={() => onToggle(item)}
                title={period.fullLabel}
              >
                {checked ? <Check size={16} className="mx-auto" /> : period.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function SharePanel({ activeSpace, onCopy, onSwitch }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Share2 size={18} className="text-slate-500" />
        <h2 className="font-semibold">Space code</h2>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3">
        <span className="text-2xl font-semibold tracking-widest">{activeSpace || "------"}</span>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm" onClick={onCopy} aria-label="Copy space code">
          <Clipboard size={17} />
        </button>
      </div>
      <p className="mt-3 text-sm text-slate-500">Share this code with your partner. Joining the same code syncs the card list and checkoffs; your display name stays private.</p>
      <button className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white" onClick={onSwitch}>
        <RefreshCw size={16} />
        Switch space
      </button>
    </section>
  );
}

function Nudges({ cards, onEdit }) {
  const needsReset = cards.filter((card) => card.resetType === "anniversary" && !card.resetDate);
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <CalendarDays size={18} className="text-slate-500" />
        <h2 className="font-semibold">Reset dates</h2>
      </div>
      {needsReset.length ? (
        <div className="mt-3 flex flex-col gap-2">
          {needsReset.map((card) => (
            <button key={card.id} className="flex items-center justify-between rounded-2xl bg-amber-50 px-3 py-3 text-left text-sm text-amber-900" onClick={() => onEdit(card)}>
              <span className="font-medium">{card.name}</span>
              <span>set reset date</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">Every anniversary card has a reset date.</p>
      )}
    </section>
  );
}

function TemplatePanel({ onUse }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-slate-500" />
        <h2 className="font-semibold">Built-in templates</h2>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {TEMPLATE_CARDS.map((template, index) => (
          <button key={template.name} className="rounded-2xl bg-slate-50 px-3 py-3 text-left hover:bg-slate-100" onClick={() => onUse(index)}>
            <span className="block text-sm font-semibold">{template.name}</span>
            <span className="text-xs text-slate-500">{template.benefits.length} benefits - {money(template.annualFee)} fee</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function SpaceModal({ activeSpace, input, setInput, onCreate, onJoin, onClose }) {
  return (
    <Modal onClose={onClose}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Choose your space</h2>
            <p className="mt-2 text-sm text-slate-500">Create a private shared checklist or join your partner with their code.</p>
          </div>
          {activeSpace ? <IconButton icon={X} onClick={onClose} label="Close" /> : null}
        </div>
        <button className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 font-semibold text-white" onClick={onCreate}>
          <Plus size={18} />
          Create new space
        </button>
        <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          or join
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <input
          className="min-h-12 w-full rounded-2xl border border-slate-200 px-4 text-center text-xl font-semibold tracking-widest outline-none focus:border-slate-950"
          placeholder="ABC123"
          value={input}
          onChange={(event) => setInput(event.target.value.toUpperCase())}
        />
        <button className="mt-3 min-h-12 w-full rounded-2xl bg-slate-100 px-4 font-semibold" onClick={onJoin} disabled={!input.trim()}>
          Join space
        </button>
      </div>
    </Modal>
  );
}

function CardEditor({
  editor,
  setEditor,
  addMode,
  setAddMode,
  templateIndex,
  setTemplateIndex,
  quantity,
  setQuantity,
  onAddTemplate,
  onSave,
  aiState,
  onResearch,
  onClose
}) {
  const card = editor.card;
  const isAdd = editor.mode === "add";

  function update(patch) {
    setEditor((current) => ({ ...current, card: { ...current.card, ...patch } }));
  }

  function updateBenefit(index, patch) {
    const benefits = card.benefits.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
    update({ benefits });
  }

  function removeBenefit(index) {
    update({ benefits: card.benefits.filter((_, itemIndex) => itemIndex !== index) });
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex max-h-screen flex-col sm:max-h-full">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            <h2 className="text-2xl font-semibold">{isAdd ? "Add card" : "Edit card"}</h2>
            <p className="mt-1 text-sm text-slate-500">Each physical card gets its own checklist.</p>
          </div>
          <IconButton icon={X} onClick={onClose} label="Close" />
        </div>

        <div className="overflow-y-auto p-5">
          {isAdd ? (
            <div className="mb-5 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
              {["template", "custom"].map((mode) => (
                <button key={mode} className={classNames("min-h-11 rounded-xl text-sm font-semibold", addMode === mode ? "bg-white shadow-sm" : "text-slate-500")} onClick={() => setAddMode(mode)}>
                  {mode === "template" ? "Template" : "Custom"}
                </button>
              ))}
            </div>
          ) : null}

          {isAdd && addMode === "template" ? (
            <div className="flex flex-col gap-4">
              <Field label="Template">
                <select className="field" value={templateIndex} onChange={(event) => setTemplateIndex(Number(event.target.value))}>
                  {TEMPLATE_CARDS.map((template, index) => <option key={template.name} value={index}>{template.name}</option>)}
                </select>
              </Field>
              <Field label="Quantity">
                <input className="field" type="number" min="1" max="25" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
              </Field>
              <button className="min-h-12 rounded-2xl bg-slate-950 px-4 font-semibold text-white" onClick={onAddTemplate}>
                Add selected cards
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Card name">
                  <input className="field" value={card.name} onChange={(event) => update({ name: event.target.value })} placeholder="Card name" />
                </Field>
                <Field label="Issuer">
                  <input className="field" value={card.issuer} onChange={(event) => update({ issuer: event.target.value || "Custom" })} placeholder="Issuer" />
                </Field>
                <Field label="Annual fee">
                  <input className="field" type="number" min="0" value={card.annualFee} onChange={(event) => update({ annualFee: Number(event.target.value) })} />
                </Field>
                <Field label="Resets on">
                  <select className="field" value={card.resetType} onChange={(event) => update({ resetType: event.target.value })}>
                    <option value="calendar">Calendar year</option>
                    <option value="anniversary">Card anniversary</option>
                  </select>
                </Field>
                {card.resetType === "anniversary" ? (
                  <Field label="Anniversary date">
                    <input className="field" type="date" value={card.resetDate} onChange={(event) => update({ resetDate: event.target.value })} />
                  </Field>
                ) : null}
              </div>

              {isAdd && addMode === "custom" ? (
                <button className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 font-semibold" onClick={onResearch} disabled={aiState.status === "loading" || !card.name.trim()}>
                  <Bot size={18} />
                  {aiState.status === "loading" ? "Researching..." : "Research benefits with AI"}
                </button>
              ) : null}
              {aiState.message ? <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{aiState.message}</p> : null}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">Benefits</h3>
                  <button className="flex min-h-10 items-center gap-2 rounded-xl bg-slate-100 px-3 text-sm font-semibold" onClick={() => update({ benefits: [...card.benefits, benefit("", 0, "monthly", "")] })}>
                    <Plus size={16} />
                    Add
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {card.benefits.map((item, index) => (
                    <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
                      <div className="grid gap-2 sm:grid-cols-3">
                        <input className="field sm:col-span-3" value={item.name} onChange={(event) => updateBenefit(index, { name: event.target.value })} placeholder="Benefit name" />
                        <input className="field" type="number" min="0" value={item.value} onChange={(event) => updateBenefit(index, { value: Number(event.target.value) })} placeholder="Annual value" />
                        <select className="field" value={item.cadence} onChange={(event) => updateBenefit(index, { cadence: event.target.value })}>
                          {CADENCES.map((cadence) => <option key={cadence} value={cadence}>{cadence}</option>)}
                        </select>
                        <button className="min-h-11 rounded-xl bg-white text-sm font-semibold text-rose-600" onClick={() => removeBenefit(index)}>Remove</button>
                        <textarea className="field sm:col-span-3" rows="2" value={item.note} onChange={(event) => updateBenefit(index, { note: event.target.value })} placeholder="Note" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {!(isAdd && addMode === "template") ? (
          <div className="border-t border-slate-100 p-5">
            <button className="min-h-12 w-full rounded-2xl bg-slate-950 px-4 font-semibold text-white disabled:bg-slate-300" onClick={onSave} disabled={!card.name.trim()}>
              Save card
            </button>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-600">
      {label}
      {React.cloneElement(children, {
        className: classNames(children.props.className, "min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none focus:border-slate-950")
      })}
    </label>
  );
}

function IconButton({ icon: Icon, onClick, label }) {
  return (
    <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600" onClick={onClick} aria-label={label}>
      <Icon size={18} />
    </button>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" style={{ backgroundColor: "rgba(15,23,42,0.45)" }} onMouseDown={onClose}>
      <div className="max-h-screen w-full overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-full sm:max-w-2xl sm:rounded-2xl" onMouseDown={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function cleanCard(card) {
  if (!card?.name?.trim()) return null;
  return {
    ...card,
    name: card.name.trim(),
    issuer: card.issuer?.trim() || "Custom",
    annualFee: Number(card.annualFee) || 0,
    benefits: card.benefits
      .filter((item) => item.name.trim())
      .map((item) => ({
        ...item,
        name: item.name.trim(),
        value: Number(item.value) || 0,
        cadence: CADENCES.includes(item.cadence) ? item.cadence : "monthly",
        note: item.note?.trim() || "",
        verify: Boolean(item.verify)
      }))
  };
}

async function researchBenefits(editor, setEditor, setAiState) {
  const cardName = editor.card.name.trim();
  if (!cardName) return;
  setAiState({ status: "loading", message: "" });
  const prompt = `Return ONLY a JSON array of recurring use-it-or-lose-it credit card benefits for "${cardName}". Each item must be {"name": string, "value": annual dollar value number, "cadence": "monthly"|"quarterly"|"semi-annual"|"annual"|"perk", "note": string}. Include recurring credits and important perks only.`;
  try {
    let text = "";
    if (window.anthropic?.messages?.create) {
      const response = await window.anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      });
      text = response.content?.map((part) => part.text || "").join("") || "";
    } else {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const json = await response.json();
      text = json.content?.map((part) => part.text || "").join("") || JSON.stringify(json);
    }
    const parsed = JSON.parse(text.replace(/^```json|```$/g, "").trim());
    if (!Array.isArray(parsed)) throw new Error("AI response was not an array");
    const benefits = parsed.map((item) => ({
      id: uid("benefit"),
      name: String(item.name || "").trim(),
      value: Number(item.value) || 0,
      cadence: CADENCES.includes(item.cadence) ? item.cadence : "annual",
      note: String(item.note || "Verify current terms.").trim(),
      verify: true
    })).filter((item) => item.name);
    if (!benefits.length) throw new Error("AI returned no benefits");
    setEditor((current) => ({ ...current, card: { ...current.card, benefits } }));
    setAiState({ status: "done", message: "AI results added. They are flagged verify until you confirm the terms." });
  } catch (error) {
    setAiState({ status: "error", message: `AI research could not complete here. You can still enter benefits manually. ${error.message}` });
  }
}
