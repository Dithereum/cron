-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 13, 2021 at 07:30 AM
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
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `bridge_transactions`
--

CREATE TABLE `bridge_transactions` (
  `id` int(11) NOT NULL,
  `userWallet` varchar(50) NOT NULL,
  `orderID` int(11) NOT NULL,
  `fromChain` int(11) NOT NULL,
  `fromCurrency` varchar(5) NOT NULL,
  `fromTxnHash` varchar(70) NOT NULL,
  `fromAmount` float NOT NULL,
  `toChain` int(11) NOT NULL,
  `toCurrency` varchar(5) NOT NULL,
  `toTxnHash` varchar(70) NOT NULL,
  `toAmount` float NOT NULL,
  `txnFee` float NOT NULL DEFAULT '0',
  `status` varchar(10) NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bridge_transactions`
--

INSERT INTO `bridge_transactions` (`id`, `userWallet`, `orderID`, `fromChain`, `fromCurrency`, `fromTxnHash`, `fromAmount`, `toChain`, `toCurrency`, `toTxnHash`, `toAmount`, `txnFee`, `status`) VALUES
(1, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 1, 126, 'BNB', '0x38cf54af596b7179c1219030d9d3d07be7deda1e85e73fe6dbb42b09d20b3a14', 0.0123, 24, 'BNB', '0x38cf54af596b7179c1219030d9d3d07be7deda1e85e73fe6dbb42b09d20b3a14', 0.0123, 0, 'Pending'),
(2, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 1, 100, 'USDT', '0x38cf54af596b7179c1219030d9d3d07be7deda1e85e73fe6dbb42b09d20b3a14', 111.5, 24, 'DUSD', '0x38cf54af596b7179c1219030d9d3d07be7deda1e85e73fe6dbb42b09d20b3a14', 111.5, 0, 'Pending'),
(3, '+.fn!\"¡ÊŠf}¡oÖÀüž', 4, 56, 'BNB', '„j\\-#éçnÉàík‰»$þ¢¸dF§\'w\r*½‰¨ê\'', 1250000, 0, '', '', 0, 0, 'Pending'),
(4, '+.fn!\"¡ÊŠf}¡oÖÀüž', 5, 56, 'BNB', 's”Ò~àøOÑí®š?\Z”ìµîFß:IØ91›º¤=@', 55555600, 0, '', '', 0, 0, 'Pending'),
(5, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 4, 56, 'BNB', '0x846a5c812d23e9e76ec9e0ed6b89bb1424fea2b86446a727770d2abd89a8ea27', 1250000, 0, '', '', 0, 0, 'Pending'),
(6, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 5, 56, 'BNB', '0x7394d27ee0f84f1cd111edae119a3f1a94ecb5ee46df3a49d839319bbaa43d40', 55555600, 0, '', '', 0, 0, 'Pending'),
(7, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 4, 56, 'BNB', '0x846a5c812d23e9e76ec9e0ed6b89bb1424fea2b86446a727770d2abd89a8ea27', 1250000, 24, 'BNB', '', 0, 0, 'Pending'),
(8, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 5, 56, 'BNB', '0x7394d27ee0f84f1cd111edae119a3f1a94ecb5ee46df3a49d839319bbaa43d40', 55555600, 24, 'BNB', '', 0, 0, 'Pending'),
(9, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 1, 56, 'BUSD', '0x2dad714d11346bd99d2786e4bac682b49dae9a36bc361eb05790650eb2e8f112', 1200000, 24, 'DUSD', '0xd891311bc5cede4e15b01cdb670fd7c00f6b85f542f9c76f154112950f3a0b11', 1000, 0, 'Completed'),
(10, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 2, 56, 'BUSD', '0x31fbcbde03dbb026e53bf4fbf2029bbf40eafb9a6f975fd2a32e4a598176594f', 1200000, 24, 'DUSD', '', 0, 0, 'Pending'),
(11, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 3, 56, 'BUSD', '0x235d843e024702744b007db489a81fd037b6c9b673b199c8eaeaf3d77f4f4b62', 55555600000, 24, 'DUSD', '', 0, 0, 'Pending'),
(12, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 1, 56, 'BUSD', '0x2dad714d11346bd99d2786e4bac682b49dae9a36bc361eb05790650eb2e8f112', 1200000, 24, 'DUSD', '0xd891311bc5cede4e15b01cdb670fd7c00f6b85f542f9c76f154112950f3a0b11', 1000, 0, 'Completed'),
(13, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 2, 56, 'BUSD', '0x31fbcbde03dbb026e53bf4fbf2029bbf40eafb9a6f975fd2a32e4a598176594f', 1200000, 24, 'DUSD', '', 0, 0, 'Pending'),
(14, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 3, 56, 'BUSD', '0x235d843e024702744b007db489a81fd037b6c9b673b199c8eaeaf3d77f4f4b62', 55555600000, 24, 'DUSD', '', 0, 0, 'Pending'),
(15, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 7, 56, 'BUSD', '0xad8941f768e8ba0995abdf8db12550d0be0703f5a6321ab6794a4affa8fd1ff1', 10000000, 24, 'DUSD', '', 0, 0, 'Pending'),
(16, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 1, 24, 'ETH', '0xb0942cbf80730b1cfab8601f149d20fe63a8926b378a494f1f5e4cfc98a75dea', 1000, 1, 'ETH', '', 0, 0, 'Pending'),
(17, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 3, 24, 'MATIC', '0xbf07a9fd15a93eadd203100d2d93eeb653604cd1307aa20255c24db8a45e75d3', 22222, 137, 'MATIC', '', 0, 0, 'Pending'),
(18, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 4, 24, 'HT', '0xebc6725aca3dd1360a45ac47d8515a1444f0df2083aed1bfc3c422e9e4834995', 33333, 128, 'HT', '', 0, 0, 'Pending'),
(19, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 2, 24, 'BNB', '0xec74441708c894115e46ca145eab0d281156239530984a2c37c4d53f8e466230', 1111, 56, 'BNB', '', 0, 0, 'Pending'),
(20, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 1, 24, 'ETH', '0xb0942cbf80730b1cfab8601f149d20fe63a8926b378a494f1f5e4cfc98a75dea', 1000, 1, 'ETH', '', 0, 0, 'Pending'),
(21, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 2, 24, 'BNB', '0xec74441708c894115e46ca145eab0d281156239530984a2c37c4d53f8e466230', 1111, 56, 'BNB', '', 0, 0, 'Pending'),
(22, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 3, 24, 'MATIC', '0xbf07a9fd15a93eadd203100d2d93eeb653604cd1307aa20255c24db8a45e75d3', 22222, 137, 'MATIC', '', 0, 0, 'Pending'),
(23, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 4, 24, 'HT', '0xebc6725aca3dd1360a45ac47d8515a1444f0df2083aed1bfc3c422e9e4834995', 33333, 128, 'HT', '', 0, 0, 'Pending'),
(24, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 5, 24, 'DUSD', '0x5d8aa49e4afd2cb0404b3fee9eec8b2e4c15098ae483b524703c6aeab129c5c3', 444444, 56, 'BUSD', '', 0, 0, 'Pending'),
(25, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 1, 24, 'ETH', '0xb0942cbf80730b1cfab8601f149d20fe63a8926b378a494f1f5e4cfc98a75dea', 1000, 1, 'ETH', '', 0, 0, 'Pending'),
(26, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 2, 24, 'BNB', '0xec74441708c894115e46ca145eab0d281156239530984a2c37c4d53f8e466230', 1111, 56, 'BNB', '', 0, 0, 'Pending'),
(27, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 3, 24, 'MATIC', '0xbf07a9fd15a93eadd203100d2d93eeb653604cd1307aa20255c24db8a45e75d3', 22222, 137, 'MATIC', '', 0, 0, 'Pending'),
(28, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 4, 24, 'HT', '0xebc6725aca3dd1360a45ac47d8515a1444f0df2083aed1bfc3c422e9e4834995', 33333, 128, 'HT', '', 0, 0, 'Pending'),
(29, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 5, 24, 'DUSD', '0x5d8aa49e4afd2cb0404b3fee9eec8b2e4c15098ae483b524703c6aeab129c5c3', 444444, 56, 'BUSD', '', 0, 0, 'Pending'),
(30, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 1, 24, 'ETH', '0xb0942cbf80730b1cfab8601f149d20fe63a8926b378a494f1f5e4cfc98a75dea', 1000, 1, 'ETH', '', 0, 0, 'Pending'),
(31, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 2, 24, 'BNB', '0xec74441708c894115e46ca145eab0d281156239530984a2c37c4d53f8e466230', 1111, 56, 'BNB', '', 0, 0, 'Pending'),
(32, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 3, 24, 'MATIC', '0xbf07a9fd15a93eadd203100d2d93eeb653604cd1307aa20255c24db8a45e75d3', 22222, 137, 'MATIC', '', 0, 0, 'Pending'),
(33, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 4, 24, 'HT', '0xebc6725aca3dd1360a45ac47d8515a1444f0df2083aed1bfc3c422e9e4834995', 33333, 128, 'HT', '', 0, 0, 'Pending'),
(34, '0x2B2E666e1D211e22a1Ca8a66147da16Fd6C0fc9E', 5, 24, 'DUSD', '0x5d8aa49e4afd2cb0404b3fee9eec8b2e4c15098ae483b524703c6aeab129c5c3', 444444, 56, 'BUSD', '', 0, 0, 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `lastblock`
--

CREATE TABLE `lastblock` (
  `id` int(11) NOT NULL DEFAULT '0',
  `bsc` int(11) NOT NULL,
  `dithereum` int(11) NOT NULL,
  `hecochain` int(11) NOT NULL,
  `polygon` int(11) NOT NULL,
  `ethereum` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lastblock`
--

INSERT INTO `lastblock` (`id`, `bsc`, `dithereum`, `hecochain`, `polygon`, `ethereum`) VALUES
(14876897, 0, 177479, 0, 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bridge_transactions`
--
ALTER TABLE `bridge_transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lastblock`
--
ALTER TABLE `lastblock`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bridge_transactions`
--
ALTER TABLE `bridge_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
