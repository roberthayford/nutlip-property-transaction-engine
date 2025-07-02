"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Building,
  CheckCircle,
  Bell,
  Home,
  Calendar,
  Inbox,
  Check,
  Pause,
  X,
  RefreshCw,
  PoundSterling,
  Eye,
  Phone,
  Mail,
  MessageSquare,
  User,
  TrendingUp,
  BarChart3,
  Users,
  MapPin,
  Search,
  Plus,
  Camera,
} from "lucide-react"

// Mock data for properties and transactions
const mockProperties = [
  {
    id: "prop-1",
    address: "123 Victoria Street",
    area: "London, SW1A 1AA",
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Parking"],
    status: "proof-of-funds",
    buyer: "John Smith",
    urgency: "high",
    daysOnMarket: 28,
    viewings: 12,
    offers: 3,
    stage: "proof-of-funds",
    lastUpdate: "Documents awaiting your review",
  },
  {
    id: "prop-2",
    address: "456 Oak Avenue",
    area: "London, SW2B 2BB",
    price: 320000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Garden"],
    status: "search-survey",
    buyer: "Emma Wilson",
    urgency: "medium",
    daysOnMarket: 45,
    viewings: 8,
    offers: 2,
    stage: "search-survey",
    lastUpdate: "On track for completion",
  },
  {
    id: "prop-3",
    address: "789 Pine Close",
    area: "London, SW3C 3CC",
    price: 275000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Balcony"],
    status: "enquiries",
    buyer: "Michael Brown",
    urgency: "medium",
    daysOnMarket: 32,
    viewings: 15,
    offers: 4,
    stage: "enquiries",
    lastUpdate: "Awaiting seller responses",
  },
  {
    id: "prop-4",
    address: "321 Maple Drive",
    area: "London, SW4D 4DD",
    price: 380000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Garage"],
    status: "mortgage-offer",
    buyer: "Sarah Johnson",
    urgency: "low",
    daysOnMarket: 21,
    viewings: 6,
    offers: 1,
    stage: "mortgage-offer",
    lastUpdate: "Mortgage application in progress",
  },
  {
    id: "prop-5",
    address: "654 Birch Lane",
    area: "London, SW5E 5EE",
    price: 295000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Garden"],
    status: "completion-date",
    buyer: "David Lee",
    urgency: "high",
    daysOnMarket: 38,
    viewings: 10,
    offers: 2,
    stage: "completion-date",
    lastUpdate: "Completion date being arranged",
  },
  {
    id: "prop-6",
    address: "987 Cedar Road",
    area: "London, SW6F 6FF",
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Parking", "Conservatory"],
    status: "contract-exchange",
    buyer: "Lisa Taylor",
    urgency: "high",
    daysOnMarket: 42,
    viewings: 14,
    offers: 3,
    stage: "contract-exchange",
    lastUpdate: "Ready for contract exchange",
  },
  {
    id: "prop-7",
    address: "147 Elm Street",
    area: "London, SW7G 7GG",
    price: 365000,
    bedrooms: 2,
    bathrooms: 2,
    features: ["Balcony", "Parking"],
    status: "replies-to-requisitions",
    buyer: "Robert Wilson",
    urgency: "high",
    daysOnMarket: 35,
    viewings: 9,
    offers: 2,
    stage: "replies-to-requisitions",
    lastUpdate: "Requisitions need urgent response",
  },
  {
    id: "prop-8",
    address: "258 Willow Way",
    area: "London, SW8H 8HH",
    price: 310000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Garden"],
    status: "nutlip-transaction-fee",
    buyer: "Jennifer Davis",
    urgency: "medium",
    daysOnMarket: 29,
    viewings: 7,
    offers: 1,
    stage: "nutlip-transaction-fee",
    lastUpdate: "Transaction fee being processed",
  },
]

const completedProperties = [
  {
    id: "comp-1",
    address: "111 Richmond Avenue",
    area: "London, SW9I 9II",
    price: 395000,
    buyer: "Mark Thompson",
    completionDate: "2024-03-15",
    daysToComplete: 45,
    commission: 5925,
  },
  {
    id: "comp-2",
    address: "222 Kensington Street",
    area: "London, SW10J 0JJ",
    price: 285000,
    buyer: "Anna Clarke",
    completionDate: "2024-03-10",
    daysToComplete: 38,
    commission: 4275,
  },
  {
    id: "comp-3",
    address: "333 Chelsea Road",
    area: "London, SW11K 1KK",
    price: 445000,
    buyer: "Peter Adams",
    completionDate: "2024-03-08",
    daysToComplete: 52,
    commission: 6675,
  },
  {
    id: "comp-4",
    address: "444 Belgravia Drive",
    area: "London, SW12L 2LL",
    price: 325000,
    buyer: "Helen Wright",
    completionDate: "2024-03-05",
    daysToComplete: 41,
    commission: 4875,
  },
]

// Mock data for declined offers
const declinedOffers = [
  {
    id: "declined-1",
    address: "15 Hampstead Road",
    area: "London, NW3 2AA",
    price: 380000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Parking"],
    buyer: "Tom Anderson",
    offerAmount: 350000,
    declinedDate: "2024-03-20",
    declineReason: "Offer too low - seller wants asking price",
    daysOnMarket: 15,
    viewings: 8,
    totalOffers: 2,
    status: "declined",
  },
  {
    id: "declined-2",
    address: "42 Notting Hill Gate",
    area: "London, W11 3HT",
    price: 295000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Balcony"],
    buyer: "Rachel Green",
    offerAmount: 270000,
    declinedDate: "2024-03-18",
    declineReason: "Seller received higher offer from another buyer",
    daysOnMarket: 22,
    viewings: 12,
    totalOffers: 4,
    status: "declined",
  },
  {
    id: "declined-3",
    address: "78 Marylebone High Street",
    area: "London, W1U 5AP",
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Garage"],
    buyer: "James Wilson",
    offerAmount: 400000,
    declinedDate: "2024-03-16",
    declineReason: "Buyer couldn't provide proof of funds quickly enough",
    daysOnMarket: 31,
    viewings: 18,
    totalOffers: 3,
    status: "declined",
  },
  {
    id: "declined-4",
    address: "156 Paddington Street",
    area: "London, W1U 5QE",
    price: 340000,
    bedrooms: 2,
    bathrooms: 2,
    features: ["Parking", "Balcony"],
    buyer: "Sophie Miller",
    offerAmount: 335000,
    declinedDate: "2024-03-14",
    declineReason: "Seller decided not to sell at this time",
    daysOnMarket: 28,
    viewings: 14,
    totalOffers: 2,
    status: "declined",
  },
  {
    id: "declined-5",
    address: "89 Fitzrovia Street",
    area: "London, W1T 6EU",
    price: 275000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Garden"],
    buyer: "Alex Thompson",
    offerAmount: 260000,
    declinedDate: "2024-03-12",
    declineReason: "Offer significantly below asking price",
    daysOnMarket: 19,
    viewings: 9,
    totalOffers: 1,
    status: "declined",
  },
]

const acceptedOffers = [
  {
    id: "accepted-1",
    address: "123 Victoria Street",
    area: "London, SW1A 1AA",
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Parking"],
    buyer: "John Smith",
    offerAmount: 450000,
    acceptedDate: "2024-03-22",
    acceptanceReason: "Full asking price offer with quick completion",
    daysOnMarket: 28,
    viewings: 12,
    totalOffers: 3,
    status: "accepted",
    stage: "proof-of-funds",
    urgency: "high",
    lastUpdate: "Documents awaiting your review",
  },
  {
    id: "accepted-2",
    address: "456 Oak Avenue",
    area: "London, SW2B 2BB",
    price: 320000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Garden"],
    buyer: "Emma Wilson",
    offerAmount: 315000,
    acceptedDate: "2024-03-20",
    acceptanceReason: "Best offer received, buyer chain-free",
    daysOnMarket: 45,
    viewings: 8,
    totalOffers: 2,
    status: "accepted",
    stage: "search-survey",
    urgency: "medium",
    lastUpdate: "On track for completion",
  },
  {
    id: "accepted-3",
    address: "789 Pine Close",
    area: "London, SW3C 3CC",
    price: 275000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Balcony"],
    buyer: "Michael Brown",
    offerAmount: 270000,
    acceptedDate: "2024-03-18",
    acceptanceReason: "Competitive offer with flexible completion date",
    daysOnMarket: 32,
    viewings: 15,
    totalOffers: 4,
    status: "accepted",
    stage: "enquiries",
    urgency: "medium",
    lastUpdate: "Awaiting seller responses",
  },
  {
    id: "accepted-4",
    address: "321 Maple Drive",
    area: "London, SW4D 4DD",
    price: 380000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Garage"],
    buyer: "Sarah Johnson",
    offerAmount: 375000,
    acceptedDate: "2024-03-16",
    acceptanceReason: "Strong financial position, mortgage pre-approved",
    daysOnMarket: 21,
    viewings: 6,
    offers: 1,
    status: "accepted",
    stage: "mortgage-offer",
    urgency: "low",
    lastUpdate: "Mortgage application in progress",
  },
  {
    id: "accepted-5",
    address: "654 Birch Lane",
    area: "London, SW5E 5EE",
    price: 295000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Garden"],
    buyer: "David Lee",
    offerAmount: 290000,
    acceptedDate: "2024-03-14",
    acceptanceReason: "Cash buyer, no chain complications",
    daysOnMarket: 38,
    viewings: 10,
    offers: 2,
    status: "accepted",
    stage: "completion-date",
    urgency: "high",
    lastUpdate: "Completion date being arranged",
  },
]

// Mock data for offers on hold
const offersOnHold = [
  {
    id: "hold-1",
    address: "67 Regent Street",
    area: "London, W1B 4EA",
    price: 385000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Parking"],
    buyer: "Catherine Brown",
    offerAmount: 375000,
    holdDate: "2024-03-21",
    holdReason: "Buyer needs to sell current property first - chain dependency",
    expectedResolution: "2024-04-15",
    daysOnMarket: 25,
    viewings: 11,
    totalOffers: 2,
    status: "on-hold",
    urgency: "medium",
    lastUpdate: "Awaiting buyer's property sale completion",
  },
  {
    id: "hold-2",
    address: "134 Oxford Street",
    area: "London, W1D 1LL",
    price: 295000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Balcony", "Parking"],
    buyer: "Daniel Martinez",
    offerAmount: 290000,
    holdDate: "2024-03-19",
    holdReason: "Mortgage application pending - awaiting lender decision",
    expectedResolution: "2024-04-05",
    daysOnMarket: 33,
    viewings: 9,
    totalOffers: 3,
    status: "on-hold",
    urgency: "high",
    lastUpdate: "Mortgage underwriter reviewing application",
  },
  {
    id: "hold-3",
    address: "245 Bond Street",
    area: "London, W1S 2UP",
    price: 420000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Garage", "Conservatory"],
    buyer: "Rebecca Taylor",
    offerAmount: 410000,
    holdDate: "2024-03-17",
    holdReason: "Seller requested time to consider multiple offers",
    expectedResolution: "2024-03-30",
    daysOnMarket: 18,
    viewings: 16,
    totalOffers: 5,
    status: "on-hold",
    urgency: "medium",
    lastUpdate: "Seller comparing all received offers",
  },
  {
    id: "hold-4",
    address: "78 Baker Street",
    area: "London, W1U 6AG",
    price: 340000,
    bedrooms: 2,
    bathrooms: 2,
    features: ["Garden", "Parking"],
    buyer: "Andrew Wilson",
    offerAmount: 335000,
    holdDate: "2024-03-15",
    holdReason: "Legal issues with property title - awaiting resolution",
    expectedResolution: "2024-04-20",
    daysOnMarket: 41,
    viewings: 13,
    totalOffers: 2,
    status: "on-hold",
    urgency: "low",
    lastUpdate: "Solicitor working on title deed clarification",
  },
  {
    id: "hold-5",
    address: "92 Harley Street",
    area: "London, W1G 7HJ",
    price: 275000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Garden"],
    buyer: "Michelle Davis",
    offerAmount: 270000,
    holdDate: "2024-03-13",
    holdReason: "Buyer relocating for work - timing coordination needed",
    expectedResolution: "2024-04-10",
    daysOnMarket: 29,
    viewings: 7,
    totalOffers: 1,
    status: "on-hold",
    urgency: "medium",
    lastUpdate: "Coordinating completion with buyer's relocation",
  },
]

// Mock data for received offers (awaiting seller decision)
const receivedOffers = [
  {
    id: "received-1",
    address: "45 Piccadilly",
    area: "London, W1J 0DS",
    price: 395000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Parking", "Conservatory"],
    buyer: "Oliver Thompson",
    offerAmount: 385000,
    receivedDate: "2024-03-23",
    offerDetails: "Full asking price with 10% deposit ready",
    buyerProfile: "First-time buyer, mortgage pre-approved",
    daysOnMarket: 12,
    viewings: 8,
    totalOffers: 1,
    status: "received",
    urgency: "high",
    lastUpdate: "Seller reviewing offer - response expected within 48 hours",
    chainFree: true,
    mortgageApproved: true,
    depositReady: true,
  },
  {
    id: "received-2",
    address: "156 Knightsbridge",
    area: "London, SW1X 7PA",
    price: 285000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Balcony", "Parking"],
    buyer: "Grace Martinez",
    offerAmount: 275000,
    receivedDate: "2024-03-22",
    offerDetails: "Competitive offer with flexible completion date",
    buyerProfile: "Chain-free buyer, cash purchase",
    daysOnMarket: 18,
    viewings: 12,
    totalOffers: 2,
    status: "received",
    urgency: "medium",
    lastUpdate: "Awaiting seller decision - multiple offers received",
    chainFree: true,
    mortgageApproved: false,
    depositReady: true,
  },
  {
    id: "received-3",
    address: "89 Sloane Street",
    area: "London, SW1X 9NR",
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Garage"],
    buyer: "Henry Clarke",
    offerAmount: 415000,
    receivedDate: "2024-03-21",
    offerDetails: "Strong offer with quick completion timeline",
    buyerProfile: "Experienced buyer, excellent financial position",
    daysOnMarket: 24,
    viewings: 15,
    totalOffers: 3,
    status: "received",
    urgency: "high",
    lastUpdate: "Seller considering offer alongside two others",
    chainFree: false,
    mortgageApproved: true,
    depositReady: true,
  },
  {
    id: "received-4",
    address: "234 King's Road",
    area: "London, SW3 5UL",
    price: 315000,
    bedrooms: 2,
    bathrooms: 2,
    features: ["Garden", "Parking"],
    buyer: "Isabella Wright",
    offerAmount: 310000,
    receivedDate: "2024-03-20",
    offerDetails: "Near asking price with standard terms",
    buyerProfile: "Young professional, first-time buyer",
    daysOnMarket: 31,
    viewings: 9,
    totalOffers: 1,
    status: "received",
    urgency: "medium",
    lastUpdate: "Seller taking time to consider single offer received",
    chainFree: true,
    mortgageApproved: true,
    depositReady: false,
  },
  {
    id: "received-5",
    address: "67 Fulham Road",
    area: "London, SW3 6HY",
    price: 365000,
    bedrooms: 2,
    bathrooms: 2,
    features: ["Balcony", "Parking", "Modern Kitchen"],
    buyer: "Jack Anderson",
    offerAmount: 355000,
    receivedDate: "2024-03-19",
    offerDetails: "Competitive offer with personal letter to seller",
    buyerProfile: "Family buyer, relocating for work",
    daysOnMarket: 28,
    viewings: 11,
    totalOffers: 2,
    status: "received",
    urgency: "low",
    lastUpdate: "Seller impressed with buyer's personal approach",
    chainFree: false,
    mortgageApproved: true,
    depositReady: true,
  },
  {
    id: "received-6",
    address: "123 Brompton Road",
    area: "London, SW3 1DE",
    price: 275000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Garden"],
    buyer: "Lily Johnson",
    offerAmount: 270000,
    receivedDate: "2024-03-18",
    offerDetails: "Fair offer with standard completion timeline",
    buyerProfile: "Investment buyer, cash purchase",
    daysOnMarket: 35,
    viewings: 7,
    totalOffers: 1,
    status: "received",
    urgency: "medium",
    lastUpdate: "Seller considering cash offer benefits",
    chainFree: true,
    mortgageApproved: false,
    depositReady: true,
  },
  {
    id: "received-7",
    address: "178 Eaton Square",
    area: "London, SW1W 9BH",
    price: 445000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Parking", "Conservatory", "Garage"],
    buyer: "Mason Davis",
    offerAmount: 435000,
    receivedDate: "2024-03-17",
    offerDetails: "Strong offer with proof of funds provided",
    buyerProfile: "Established family, upgrading home",
    daysOnMarket: 21,
    viewings: 13,
    totalOffers: 2,
    status: "received",
    urgency: "high",
    lastUpdate: "Seller very interested - final decision pending",
    chainFree: false,
    mortgageApproved: true,
    depositReady: true,
  },
  {
    id: "received-8",
    address: "56 Cadogan Square",
    area: "London, SW1X 0EA",
    price: 325000,
    bedrooms: 2,
    bathrooms: 2,
    features: ["Balcony", "Modern Fixtures"],
    buyer: "Nora Wilson",
    offerAmount: 320000,
    receivedDate: "2024-03-16",
    offerDetails: "Near asking price with quick completion",
    buyerProfile: "Professional couple, no chain",
    daysOnMarket: 26,
    viewings: 10,
    totalOffers: 1,
    status: "received",
    urgency: "medium",
    lastUpdate: "Seller pleased with offer terms and timeline",
    chainFree: true,
    mortgageApproved: true,
    depositReady: true,
  },
  {
    id: "received-9",
    address: "89 Belgrave Square",
    area: "London, SW1X 8QB",
    price: 385000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Parking"],
    buyer: "Oscar Taylor",
    offerAmount: 375000,
    receivedDate: "2024-03-15",
    offerDetails: "Reasonable offer with flexible terms",
    buyerProfile: "Growing family, second-time buyer",
    daysOnMarket: 33,
    viewings: 14,
    totalOffers: 3,
    status: "received",
    urgency: "low",
    lastUpdate: "Seller comparing with other received offers",
    chainFree: false,
    mortgageApproved: true,
    depositReady: false,
  },
]

// Mock data for booked viewings
const bookedViewings = [
  {
    id: "viewing-1",
    address: "123 Mayfair Street",
    area: "London, W1K 6SH",
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Parking", "Modern Kitchen"],
    viewerName: "Emma Thompson",
    viewerPhone: "07123 456789",
    viewerEmail: "emma.thompson@email.com",
    viewingDate: "2024-03-25",
    viewingTime: "14:00",
    viewingType: "In-person",
    status: "confirmed",
    notes: "First-time buyer, very interested in the area",
    daysOnMarket: 18,
    totalViewings: 8,
    urgency: "high",
    lastUpdate: "Confirmed viewing - buyer very keen",
  },
  {
    id: "viewing-2",
    address: "456 Covent Garden",
    area: "London, WC2E 9RZ",
    price: 315000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Balcony", "Modern Fixtures"],
    viewerName: "James Wilson",
    viewerPhone: "07234 567890",
    viewerEmail: "james.wilson@email.com",
    viewingDate: "2024-03-25",
    viewingTime: "16:30",
    viewingType: "In-person",
    status: "confirmed",
    notes: "Investment buyer, cash purchase potential",
    daysOnMarket: 25,
    totalViewings: 12,
    urgency: "medium",
    lastUpdate: "Viewing confirmed - cash buyer interested",
  },
  {
    id: "viewing-3",
    address: "789 Bloomsbury Square",
    area: "London, WC1A 2RP",
    price: 385000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Garage"],
    viewerName: "Sarah Martinez",
    viewerPhone: "07345 678901",
    viewerEmail: "sarah.martinez@email.com",
    viewingDate: "2024-03-26",
    viewingTime: "10:00",
    viewingType: "Virtual",
    status: "confirmed",
    notes: "Relocating from Manchester, family with two children",
    daysOnMarket: 12,
    totalViewings: 6,
    urgency: "high",
    lastUpdate: "Virtual viewing scheduled - family relocating",
  },
  {
    id: "viewing-4",
    address: "321 Russell Square",
    area: "London, WC1B 5EH",
    price: 275000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Garden"],
    viewerName: "Michael Brown",
    viewerPhone: "07456 789012",
    viewerEmail: "michael.brown@email.com",
    viewingDate: "2024-03-26",
    viewingTime: "14:00",
    viewingType: "In-person",
    status: "pending",
    notes: "Young professional, first-time buyer",
    daysOnMarket: 31,
    totalViewings: 9,
    urgency: "medium",
    lastUpdate: "Awaiting final confirmation from buyer",
  },
  {
    id: "viewing-5",
    address: "654 Fitzroy Square",
    area: "London, W1T 6DX",
    price: 445000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Parking", "Conservatory"],
    viewerName: "Lisa Anderson",
    viewerPhone: "07567 890123",
    viewerEmail: "lisa.anderson@email.com",
    viewingDate: "2024-03-27",
    viewingTime: "11:00",
    viewingType: "In-person",
    status: "confirmed",
    notes: "Upgrading family home, has property to sell",
    daysOnMarket: 22,
    totalViewings: 11,
    urgency: "medium",
    lastUpdate: "Confirmed viewing - potential chain situation",
  },
  {
    id: "viewing-6",
    address: "987 Portman Square",
    area: "London, W1H 6LJ",
    price: 295000,
    bedrooms: 2,
    bathrooms: 2,
    features: ["Balcony", "Parking"],
    viewerName: "David Clarke",
    viewerPhone: "07678 901234",
    viewerEmail: "david.clarke@email.com",
    viewingDate: "2024-03-27",
    viewingTime: "15:30",
    viewingType: "In-person",
    status: "confirmed",
    notes: "Downsizing couple, no chain",
    daysOnMarket: 28,
    totalViewings: 7,
    urgency: "low",
    lastUpdate: "Viewing confirmed - no chain complications",
  },
  {
    id: "viewing-7",
    address: "147 Grosvenor Square",
    area: "London, W1K 6JP",
    price: 365000,
    bedrooms: 2,
    bathrooms: 2,
    features: ["Modern Kitchen", "Parking"],
    viewerName: "Rachel Taylor",
    viewerPhone: "07789 012345",
    viewerEmail: "rachel.taylor@email.com",
    viewingDate: "2024-03-28",
    viewingTime: "10:30",
    viewingType: "In-person",
    status: "confirmed",
    notes: "Professional couple, mortgage pre-approved",
    daysOnMarket: 19,
    totalViewings: 13,
    urgency: "high",
    lastUpdate: "Viewing confirmed - pre-approved mortgage",
  },
  {
    id: "viewing-8",
    address: "258 Berkeley Square",
    area: "London, W1J 6BD",
    price: 335000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Garden", "Modern Fixtures"],
    viewerName: "Oliver Johnson",
    viewerPhone: "07890 123456",
    viewerEmail: "oliver.johnson@email.com",
    viewingDate: "2024-03-28",
    viewingTime: "13:00",
    viewingType: "Virtual",
    status: "pending",
    notes: "International buyer, currently overseas",
    daysOnMarket: 35,
    totalViewings: 5,
    urgency: "medium",
    lastUpdate: "Virtual viewing requested - international buyer",
  },
  {
    id: "viewing-9",
    address: "369 Cavendish Square",
    area: "London, W1G 0PN",
    price: 395000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Garage", "Conservatory"],
    viewerName: "Grace Wilson",
    viewerPhone: "07901 234567",
    viewerEmail: "grace.wilson@email.com",
    viewingDate: "2024-03-29",
    viewingTime: "11:30",
    viewingType: "In-person",
    status: "confirmed",
    notes: "Growing family, second viewing requested",
    daysOnMarket: 26,
    totalViewings: 10,
    urgency: "high",
    lastUpdate: "Second viewing - family very interested",
  },
  {
    id: "viewing-10",
    address: "741 Hanover Square",
    area: "London, W1S 1JA",
    price: 285000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Balcony"],
    viewerName: "Henry Davis",
    viewerPhone: "07012 345678",
    viewerEmail: "henry.davis@email.com",
    viewingDate: "2024-03-29",
    viewingTime: "16:00",
    viewingType: "In-person",
    status: "confirmed",
    notes: "Buy-to-let investor, multiple property portfolio",
    daysOnMarket: 33,
    totalViewings: 8,
    urgency: "low",
    lastUpdate: "Viewing confirmed - experienced investor",
  },
  {
    id: "viewing-11",
    address: "852 Manchester Square",
    area: "London, W1U 3PD",
    price: 415000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Parking"],
    viewerName: "Isabella Wright",
    viewerPhone: "07123 456789",
    viewerEmail: "isabella.wright@email.com",
    viewingDate: "2024-03-30",
    viewingTime: "12:00",
    viewingType: "In-person",
    status: "tentative",
    notes: "Needs to coordinate with partner's schedule",
    daysOnMarket: 21,
    totalViewings: 14,
    urgency: "medium",
    lastUpdate: "Tentative booking - awaiting partner availability",
  },
  {
    id: "viewing-12",
    address: "963 Bedford Square",
    area: "London, WC1B 3HH",
    price: 355000,
    bedrooms: 2,
    bathrooms: 2,
    features: ["Modern Kitchen", "Balcony"],
    viewerName: "Jack Thompson",
    viewerPhone: "07234 567890",
    viewerEmail: "jack.thompson@email.com",
    viewingDate: "2024-03-30",
    viewingTime: "14:30",
    viewingType: "In-person",
    status: "confirmed",
    notes: "First-time buyer, very enthusiastic about the property",
    daysOnMarket: 17,
    totalViewings: 6,
    urgency: "high",
    lastUpdate: "Viewing confirmed - enthusiastic first-time buyer",
  },
]

// Mock data for listed properties
const listedProperties = [
  {
    id: "listed-1",
    address: "15 Primrose Hill Road",
    area: "London, NW1 8YT",
    price: 485000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Parking", "Modern Kitchen", "Conservatory"],
    listedDate: "2024-03-20",
    daysOnMarket: 5,
    viewings: 3,
    offers: 0,
    status: "active",
    propertyType: "Terraced House",
    epcRating: "B",
    councilTaxBand: "D",
    tenure: "Freehold",
    description: "Beautiful Victorian terraced house with period features and modern upgrades",
    keyFeatures: ["Period Features", "Off-Street Parking", "South-Facing Garden", "Recently Renovated"],
    urgency: "high",
    lastUpdate: "New listing - generating strong interest",
    photos: 12,
    floorPlan: true,
    virtualTour: true,
  },
  {
    id: "listed-2",
    address: "42 Oakwood Close",
    area: "London, N10 3HU",
    price: 325000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Balcony", "Modern Fixtures", "Parking"],
    listedDate: "2024-03-18",
    daysOnMarket: 7,
    viewings: 8,
    offers: 1,
    status: "active",
    propertyType: "Flat",
    epcRating: "C",
    councilTaxBand: "C",
    tenure: "Leasehold",
    description: "Modern two-bedroom flat with excellent transport links",
    keyFeatures: ["Modern Interior", "Balcony", "Secure Parking", "Close to Transport"],
    urgency: "medium",
    lastUpdate: "First offer received - seller considering",
    photos: 8,
    floorPlan: true,
    virtualTour: false,
  },
  {
    id: "listed-3",
    address: "78 Maple Avenue",
    area: "London, E17 3DP",
    price: 395000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Garage", "Modern Kitchen"],
    listedDate: "2024-03-15",
    daysOnMarket: 10,
    viewings: 12,
    offers: 2,
    status: "active",
    propertyType: "Semi-Detached",
    epcRating: "B",
    councilTaxBand: "D",
    tenure: "Freehold",
    description: "Spacious family home with large garden and garage",
    keyFeatures: ["Family Home", "Large Garden", "Garage", "Quiet Location"],
    urgency: "high",
    lastUpdate: "Multiple offers received - best and final requested",
    photos: 15,
    floorPlan: true,
    virtualTour: true,
  },
  {
    id: "listed-4",
    address: "156 Riverside Walk",
    area: "London, SE1 9PP",
    price: 275000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["River View", "Balcony"],
    listedDate: "2024-03-12",
    daysOnMarket: 13,
    viewings: 6,
    offers: 0,
    status: "active",
    propertyType: "Apartment",
    epcRating: "C",
    councilTaxBand: "B",
    tenure: "Leasehold",
    description: "Stunning riverside apartment with panoramic views",
    keyFeatures: ["River Views", "Balcony", "Modern Interior", "Concierge Service"],
    urgency: "medium",
    lastUpdate: "Steady viewing interest - awaiting offers",
    photos: 10,
    floorPlan: true,
    virtualTour: true,
  },
  {
    id: "listed-5",
    address: "89 Victoria Terrace",
    area: "London, N1 4SA",
    price: 525000,
    bedrooms: 4,
    bathrooms: 3,
    features: ["Garden", "Parking", "Period Features", "Modern Kitchen"],
    listedDate: "2024-03-10",
    daysOnMarket: 15,
    viewings: 18,
    offers: 3,
    status: "active",
    propertyType: "Terraced House",
    epcRating: "B",
    councilTaxBand: "E",
    tenure: "Freehold",
    description: "Elegant Victorian house with original features and contemporary additions",
    keyFeatures: ["Period Character", "Four Bedrooms", "Modern Kitchen", "Private Garden"],
    urgency: "high",
    lastUpdate: "Strong interest - multiple competitive offers",
    photos: 20,
    floorPlan: true,
    virtualTour: true,
  },
  {
    id: "listed-6",
    address: "23 Garden Square",
    area: "London, E2 7EF",
    price: 365000,
    bedrooms: 2,
    bathrooms: 2,
    features: ["Garden", "Parking", "Modern Fixtures"],
    listedDate: "2024-03-08",
    daysOnMarket: 17,
    viewings: 9,
    offers: 1,
    status: "active",
    propertyType: "Maisonette",
    epcRating: "B",
    councilTaxBand: "C",
    tenure: "Leasehold",
    description: "Charming maisonette with private garden and parking",
    keyFeatures: ["Private Garden", "Two Bathrooms", "Parking Space", "Chain Free"],
    urgency: "medium",
    lastUpdate: "One offer received - seller reviewing terms",
    photos: 11,
    floorPlan: true,
    virtualTour: false,
  },
  {
    id: "listed-7",
    address: "67 Elm Grove",
    area: "London, SE15 5DF",
    price: 445000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Conservatory", "Parking"],
    listedDate: "2024-03-05",
    daysOnMarket: 20,
    viewings: 14,
    offers: 2,
    status: "active",
    propertyType: "Detached House",
    epcRating: "C",
    councilTaxBand: "D",
    tenure: "Freehold",
    description: "Detached family home with conservatory and mature garden",
    keyFeatures: ["Detached", "Conservatory", "Mature Garden", "Driveway Parking"],
    urgency: "medium",
    lastUpdate: "Two offers under consideration by seller",
    photos: 16,
    floorPlan: true,
    virtualTour: true,
  },
  {
    id: "listed-8",
    address: "134 Willow Road",
    area: "London, NW3 1TH",
    price: 295000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Garden", "Modern Kitchen"],
    listedDate: "2024-03-03",
    daysOnMarket: 22,
    viewings: 11,
    offers: 1,
    status: "active",
    propertyType: "Terraced House",
    epcRating: "C",
    councilTaxBand: "C",
    tenure: "Freehold",
    description: "Cozy terraced house perfect for first-time buyers",
    keyFeatures: ["First Time Buyer", "Modern Kitchen", "Garden", "Good Transport Links"],
    urgency: "low",
    lastUpdate: "Steady interest - one offer to consider",
    photos: 9,
    floorPlan: true,
    virtualTour: false,
  },
  {
    id: "listed-9",
    address: "91 Cedar Heights",
    area: "London, E14 9SH",
    price: 385000,
    bedrooms: 2,
    bathrooms: 2,
    features: ["Balcony", "Parking", "Modern Fixtures", "Gym"],
    listedDate: "2024-03-01",
    daysOnMarket: 24,
    viewings: 16,
    offers: 3,
    status: "active",
    propertyType: "Apartment",
    epcRating: "B",
    councilTaxBand: "C",
    tenure: "Leasehold",
    description: "Luxury apartment with gym and concierge services",
    keyFeatures: ["Luxury Development", "Gym Access", "Concierge", "Balcony"],
    urgency: "high",
    lastUpdate: "Multiple offers - seller choosing preferred buyer",
    photos: 13,
    floorPlan: true,
    virtualTour: true,
  },
  {
    id: "listed-10",
    address: "58 Birch Lane",
    area: "London, SW4 7AA",
    price: 315000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Garden", "Parking"],
    listedDate: "2024-02-28",
    daysOnMarket: 26,
    viewings: 7,
    offers: 0,
    status: "active",
    propertyType: "Semi-Detached",
    epcRating: "D",
    councilTaxBand: "C",
    tenure: "Freehold",
    description: "Well-maintained semi-detached house with potential for improvement",
    keyFeatures: ["Improvement Potential", "Garden", "Parking", "Quiet Street"],
    urgency: "low",
    lastUpdate: "Awaiting offers - price recently reduced",
    photos: 8,
    floorPlan: true,
    virtualTour: false,
  },
  {
    id: "listed-11",
    address: "172 Sycamore Street",
    area: "London, N16 7JX",
    price: 465000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Parking", "Period Features", "Conservatory"],
    listedDate: "2024-02-25",
    daysOnMarket: 29,
    viewings: 13,
    offers: 2,
    status: "active",
    propertyType: "Victorian House",
    epcRating: "C",
    councilTaxBand: "D",
    tenure: "Freehold",
    description: "Stunning Victorian house with period charm and modern comforts",
    keyFeatures: ["Victorian Character", "Period Features", "Conservatory", "Off-Street Parking"],
    urgency: "medium",
    lastUpdate: "Two competitive offers received",
    photos: 18,
    floorPlan: true,
    virtualTour: true,
  },
  {
    id: "listed-12",
    address: "45 Poplar Grove",
    area: "London, E14 0BE",
    price: 335000,
    bedrooms: 2,
    bathrooms: 2,
    features: ["Balcony", "Modern Kitchen", "Parking"],
    listedDate: "2024-02-22",
    daysOnMarket: 32,
    viewings: 10,
    offers: 1,
    status: "active",
    propertyType: "Flat",
    epcRating: "B",
    councilTaxBand: "C",
    tenure: "Leasehold",
    description: "Contemporary flat with modern amenities and excellent location",
    keyFeatures: ["Contemporary Design", "Two Bathrooms", "Balcony", "Parking Space"],
    urgency: "medium",
    lastUpdate: "One offer received - negotiations ongoing",
    photos: 12,
    floorPlan: true,
    virtualTour: false,
  },
  {
    id: "listed-13",
    address: "103 Chestnut Avenue",
    area: "London, W3 7LR",
    price: 405000,
    bedrooms: 3,
    bathrooms: 2,
    features: ["Garden", "Garage", "Modern Kitchen", "Parking"],
    listedDate: "2024-02-20",
    daysOnMarket: 34,
    viewings: 15,
    offers: 2,
    status: "active",
    propertyType: "Semi-Detached",
    epcRating: "B",
    councilTaxBand: "D",
    tenure: "Freehold",
    description: "Spacious family home with garage and landscaped garden",
    keyFeatures: ["Family Home", "Garage", "Landscaped Garden", "Modern Kitchen"],
    urgency: "high",
    lastUpdate: "Two offers - seller requesting best and final",
    photos: 14,
    floorPlan: true,
    virtualTour: true,
  },
  {
    id: "listed-14",
    address: "76 Hawthorn Close",
    area: "London, SE22 8DY",
    price: 285000,
    bedrooms: 2,
    bathrooms: 1,
    features: ["Garden", "Modern Fixtures"],
    listedDate: "2024-02-18",
    daysOnMarket: 36,
    viewings: 8,
    offers: 0,
    status: "active",
    propertyType: "Terraced House",
    epcRating: "C",
    councilTaxBand: "B",
    tenure: "Freehold",
    description: "Charming starter home with garden and modern updates",
    keyFeatures: ["Starter Home", "Garden", "Modern Updates", "Good Value"],
    urgency: "low",
    lastUpdate: "Steady viewing activity - awaiting first offer",
    photos: 10,
    floorPlan: true,
    virtualTour: false,
  },
]

type FilterType =
  | "all"
  | "listed"
  | "viewings"
  | "offers-received"
  | "offers-accepted"
  | "offers-on-hold"
  | "offers-declined"
  | "active-transactions"
  | "completed"

// Navigation items for sidebar
const navigationItems = [
  {
    name: "Dashboard",
    href: "/estate-agent",
    icon: Home,
    current: true,
  },
  {
    name: "Properties",
    href: "/estate-agent/properties",
    icon: Building,
    current: false,
    badge: "14",
  },
  {
    name: "Clients",
    href: "/estate-agent/clients",
    icon: Users,
    current: false,
    badge: "28",
  },
  {
    name: "Viewings",
    href: "/estate-agent/viewings",
    icon: Calendar,
    current: false,
    badge: "12",
  },
  {
    name: "Offers",
    href: "/estate-agent/offers",
    icon: Inbox,
    current: false,
    badge: "9",
  },
  {
    name: "Transactions",
    href: "/estate-agent/transactions",
    icon: RefreshCw,
    current: false,
    badge: "8",
  },
  {
    name: "Reports",
    href: "/estate-agent/reports",
    icon: BarChart3,
    current: false,
  },
  {
    name: "Map View",
    href: "/estate-agent/map",
    icon: MapPin,
    current: false,
  },
]

const quickActions = [
  {
    name: "Add Property",
    href: "/estate-agent/properties/new",
    icon: Plus,
  },
  {
    name: "Schedule Viewing",
    href: "/estate-agent/viewings/new",
    icon: Calendar,
  },
  {
    name: "Search Properties",
    href: "/estate-agent/search",
    icon: Search,
  },
]

export default function EstateAgentDashboard() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Calculate statistics
  const totalListed = 14
  const viewingsBooked = 12
  const offersReceived = 9
  const offersAccepted = acceptedOffers.length
  const offersOnHoldCount = offersOnHold.length
  const offersDeclined = declinedOffers.length
  const activeTransactions = mockProperties.length
  const portfolioValue = 15200000
  const completedCount = completedProperties.length

  // Filter properties based on active filter
  const getFilteredProperties = () => {
    switch (activeFilter) {
      case "listed":
        return listedProperties
      case "viewings":
        return bookedViewings
      case "offers-received":
        return receivedOffers
      case "offers-accepted":
        return acceptedOffers
      case "offers-on-hold":
        return offersOnHold
      case "active-transactions":
        return mockProperties
      case "completed":
        return completedProperties
      case "offers-declined":
        return declinedOffers
      case "all":
      default:
        return mockProperties
    }
  }

  const filteredProperties = getFilteredProperties()

  const getFilterTitle = () => {
    switch (activeFilter) {
      case "listed":
        return "Listed Properties"
      case "viewings":
        return "Booked Viewings"
      case "offers-received":
        return "Offers Received"
      case "offers-accepted":
        return "Accepted Offers"
      case "offers-on-hold":
        return "Offers On Hold"
      case "offers-declined":
        return "Declined Offers"
      case "active-transactions":
        return "Active Transactions"
      case "completed":
        return "Completed Sales"
      case "all":
      default:
        return "All Properties"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "proof-of-funds":
        return "bg-blue-100 text-blue-800"
      case "search-survey":
        return "bg-purple-100 text-purple-800"
      case "enquiries":
        return "bg-amber-100 text-amber-800"
      case "mortgage-offer":
        return "bg-green-100 text-green-800"
      case "completion-date":
        return "bg-indigo-100 text-indigo-800"
      case "contract-exchange":
        return "bg-pink-100 text-pink-800"
      case "replies-to-requisitions":
        return "bg-red-100 text-red-800"
      case "nutlip-transaction-fee":
        return "bg-orange-100 text-orange-800"
      case "declined":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getViewingStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-amber-100 text-amber-800"
      case "tentative":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPropertyStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "under-offer":
        return "bg-blue-100 text-blue-800"
      case "sold":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStageText = (stage: string) => {
    return stage
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const formatViewingDate = (date: string) => {
    const viewingDate = new Date(date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (viewingDate.toDateString() === today.toDateString()) {
      return "Today"
    } else if (viewingDate.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return viewingDate.toLocaleDateString("en-GB", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    }
  }

  const formatListingDate = (date: string) => {
    const listingDate = new Date(date)
    return listingDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Helper function to get the correct URL for transaction stages
  const getStageUrl = (stage: string) => {
    if (stage === "completion") {
      return "/estate-agent/completion"
    }
    return `/estate-agent/${stage}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-primary">
                Nutlip
              </Link>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Estate Agent Dashboard
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => (window.location.href = "https://v0-nutlip-platform-design.vercel.app/dashboard")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Property Chain Management
              </Button>
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span className="font-medium">Sarah Johnson</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Sarah!</h1>
          <p className="text-muted-foreground">Manage your property sales and coordinate transactions.</p>
        </div>

        {/* Interactive Statistics - Row 1 */}
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeFilter === "listed" ? "ring-2 ring-green-500 bg-green-50" : ""
            }`}
            onClick={() => setActiveFilter("listed")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Home className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Properties Listed</p>
                  <p className="text-2xl font-bold">{totalListed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeFilter === "viewings" ? "ring-2 ring-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => setActiveFilter("viewings")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Viewings Booked</p>
                  <p className="text-2xl font-bold">{viewingsBooked}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeFilter === "offers-received" ? "ring-2 ring-purple-500 bg-purple-50" : ""
            }`}
            onClick={() => setActiveFilter("offers-received")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Inbox className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Offers Received</p>
                  <p className="text-2xl font-bold">{offersReceived}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeFilter === "offers-accepted" ? "ring-2 ring-green-500 bg-green-50" : ""
            }`}
            onClick={() => setActiveFilter("offers-accepted")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Check className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Offers Accepted</p>
                  <p className="text-2xl font-bold">{offersAccepted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Statistics - Row 2 */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeFilter === "offers-on-hold" ? "ring-2 ring-amber-500 bg-amber-50" : ""
            }`}
            onClick={() => setActiveFilter("offers-on-hold")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Pause className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Offers On Hold</p>
                  <p className="text-2xl font-bold">{offersOnHoldCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeFilter === "offers-declined" ? "ring-2 ring-red-500 bg-red-50" : ""
            }`}
            onClick={() => setActiveFilter("offers-declined")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <X className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Offers Declined</p>
                  <p className="text-2xl font-bold">{offersDeclined}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeFilter === "active-transactions" ? "ring-2 ring-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => setActiveFilter("active-transactions")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Transactions</p>
                  <p className="text-2xl font-bold">{activeTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeFilter === "completed" ? "ring-2 ring-green-500 bg-green-50" : ""
            }`}
            onClick={() => setActiveFilter("completed")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Sales</p>
                  <p className="text-2xl font-bold">{completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Value Card */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <PoundSterling className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Portfolio Value</p>
                    <p className="text-3xl font-bold">£{portfolioValue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm font-medium">+12.5% this month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <span>{getFilterTitle()}</span>
                <Badge variant="secondary">{filteredProperties.length}</Badge>
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => setActiveFilter("all")}
                className={activeFilter === "all" ? "bg-primary text-primary-foreground" : ""}
              >
                Show All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProperties.map((property: any) => (
                <div key={property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{property.address}</h3>
                          <p className="text-muted-foreground">{property.area}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            £{property.price?.toLocaleString() || property.offerAmount?.toLocaleString()}
                          </p>
                          {property.offerAmount && property.price && property.offerAmount !== property.price && (
                            <p className="text-sm text-muted-foreground">Listed: £{property.price.toLocaleString()}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mb-3">
                        {property.bedrooms && (
                          <span className="text-sm text-muted-foreground">
                            {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
                          </span>
                        )}
                        {property.bathrooms && (
                          <span className="text-sm text-muted-foreground">
                            {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
                          </span>
                        )}
                        {property.features && (
                          <div className="flex space-x-2">
                            {property.features.slice(0, 2).map((feature: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {property.features.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{property.features.length - 2} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Different content based on filter type */}
                      {activeFilter === "viewings" && (
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{property.viewerName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {formatViewingDate(property.viewingDate)} at {property.viewingTime}
                              </span>
                            </div>
                            <Badge className={getViewingStatusColor(property.status)}>{property.status}</Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </Button>
                          </div>
                        </div>
                      )}

                      {activeFilter === "offers-received" && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{property.buyer}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                Received {new Date(property.receivedDate).toLocaleDateString("en-GB")}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              {property.chainFree && (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                  Chain Free
                                </Badge>
                              )}
                              {property.mortgageApproved && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                  Mortgage Approved
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{property.offerDetails}</p>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Accept Offer
                            </Button>
                            <Button size="sm" variant="outline">
                              Negotiate
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      )}

                      {activeFilter === "offers-accepted" && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{property.buyer}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                Accepted {new Date(property.acceptedDate).toLocaleDateString("en-GB")}
                              </span>
                            </div>
                            <Badge className={getStageColor(property.stage)}>{formatStageText(property.stage)}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{property.acceptanceReason}</p>
                          <div className="flex space-x-2">
                            <Link href={getStageUrl(property.stage)}>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                View Transaction
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Contact Buyer
                            </Button>
                          </div>
                        </div>
                      )}

                      {activeFilter === "offers-on-hold" && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{property.buyer}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                On hold since {new Date(property.holdDate).toLocaleDateString("en-GB")}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Expected: {new Date(property.expectedResolution).toLocaleDateString("en-GB")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{property.holdReason}</p>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Follow Up
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              Withdraw Hold
                            </Button>
                          </div>
                        </div>
                      )}

                      {activeFilter === "offers-declined" && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{property.buyer}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                Declined {new Date(property.declinedDate).toLocaleDateString("en-GB")}
                              </span>
                            </div>
                            <Badge className="bg-red-100 text-red-800">Declined</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{property.declineReason}</p>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Re-engage Buyer
                            </Button>
                            <Button size="sm" variant="outline">
                              Archive
                            </Button>
                          </div>
                        </div>
                      )}

                      {activeFilter === "listed" && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-muted-foreground">
                                Listed {formatListingDate(property.listedDate)}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {property.daysOnMarket} days on market
                              </span>
                              <Badge className={getPropertyStatusColor(property.status)}>{property.status}</Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{property.viewings} viewings</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Inbox className="h-4 w-4" />
                                <span>{property.offers} offers</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Button size="sm" variant="outline">
                              <Calendar className="h-4 w-4 mr-1" />
                              Book Viewing
                            </Button>
                            <Button size="sm" variant="outline">
                              <Camera className="h-4 w-4 mr-1" />
                              Photos ({property.photos})
                            </Button>
                          </div>
                        </div>
                      )}

                      {activeFilter === "active-transactions" && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{property.buyer}</span>
                              </div>
                              <Badge className={getStageColor(property.stage)}>{formatStageText(property.stage)}</Badge>
                              <Badge className={getUrgencyColor(property.urgency)}>{property.urgency} priority</Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {property.daysOnMarket} days on market
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{property.lastUpdate}</p>
                          <div className="flex space-x-2">
                            <Link href={getStageUrl(property.stage)}>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                View Transaction
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Contact Buyer
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Default view for "all" filter */}
                      {activeFilter === "all" && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{property.buyer}</span>
                              </div>
                              <Badge className={getStageColor(property.stage)}>{formatStageText(property.stage)}</Badge>
                              <Badge className={getUrgencyColor(property.urgency)}>{property.urgency} priority</Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {property.daysOnMarket} days on market
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{property.lastUpdate}</p>
                          <div className="flex space-x-2">
                            <Link href={getStageUrl(property.stage)}>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                View Transaction
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Contact Buyer
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
