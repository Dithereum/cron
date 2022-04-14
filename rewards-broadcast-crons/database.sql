-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 09, 2021 at 01:41 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.2.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dithereum`
--

-- --------------------------------------------------------

--
-- Table structure for table `deployer_data`
--

CREATE TABLE `deployer_data` (
  `id` int(11) NOT NULL,
  `contract_address` varchar(45) NOT NULL,
  `deployer_address` varchar(45) NOT NULL,
  `transaction_hash` varchar(70) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `deployer_data`
--

INSERT INTO `deployer_data` (`id`, `contract_address`, `deployer_address`, `transaction_hash`) VALUES
(1, '0x2170ed0880ac9a755fd29b2688956bd959f933f8', '0xa86e74bc23567a88c91fad3977250130e7fbd4a9', '0xbc0f785f4e87150c9b7e8664a25ef8cc8638d5514b1ac27de41a833ded8993e6'),
(2, '0x10ed43c718714eb63d5aa57b78b54704e256024e', '0xd713a86f45ae7095ff02528d2a9146c6eacc4ba4', '0x88cd944944278183cd2ae64c2168e66965b7b9f57f2ebad24b20a1bc0891e496');

-- --------------------------------------------------------

--
-- Table structure for table `lastblock`
--

CREATE TABLE `lastblock` (
  `blockid` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lastblock`
--

INSERT INTO `lastblock` (`blockid`) VALUES
(13321218);

-- --------------------------------------------------------

--
-- Table structure for table `transactions_data`
--

CREATE TABLE `transactions_data` (
  `id` int(10) UNSIGNED NOT NULL,
  `block_num` bigint(20) NOT NULL,
  `txnHash` varchar(70) NOT NULL,
  `txnMaker` varchar(50) NOT NULL,
  `contract_address` varchar(50) DEFAULT NULL,
  `trans_fee_wei` varchar(50) DEFAULT NULL,
  `deployer_addr` varchar(50) NOT NULL,
  `referrer_wallet` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



ALTER TABLE `transactions_data` ADD UNIQUE(`txnHash`);


--
-- Indexes for dumped tables
--

--
-- Indexes for table `deployer_data`
--
ALTER TABLE `deployer_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lastblock`
--
ALTER TABLE `lastblock`
  ADD PRIMARY KEY (`blockid`);

--
-- Indexes for table `transactions_data`
--
ALTER TABLE `transactions_data`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `deployer_data`
--
ALTER TABLE `deployer_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transactions_data`
--
ALTER TABLE `transactions_data`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
