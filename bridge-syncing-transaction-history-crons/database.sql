-- MySQL dump 10.13  Distrib 5.7.36, for Linux (x86_64)
--
-- Host: localhost    Database: test
-- ------------------------------------------------------
-- Server version	5.7.36-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bridge_transactions`
--

DROP TABLE IF EXISTS `bridge_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bridge_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `status` varchar(10) NOT NULL DEFAULT 'Pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=306 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bridge_transactions`
--

LOCK TABLES `bridge_transactions` WRITE;
/*!40000 ALTER TABLE `bridge_transactions` DISABLE KEYS */;
INSERT INTO `bridge_transactions` VALUES (296,'0x62E1960De1F9CA64d8fA578E871c2fe48b596b59',1,34,'ETH','0x8ca16ca304cc1943bc8f90ada476f679161896469146c7f00b52a43590725f61',1e17,4,'ETH','0x70228368ee2e32bd45779a4b98f3ac1129b2458c76d31edbc023a4d0eb3e5801',1,0,'Completed'),(297,'0x62E1960De1F9CA64d8fA578E871c2fe48b596b59',5,34,'BNB','0xf68062271b122b9351d381d58c195de43a9ed35a302f0045ed8826405cdd7a0c',1e17,97,'BNB','',0,0,'Pending'),(298,'0x62E1960De1F9CA64d8fA578E871c2fe48b596b59',4,34,'ETH','0x8ca16ca304cc1943bc8f90ada476f679161896469146c7f00b52a43590725f61',1e17,4,'ETH','',0,0,'Pending'),(299,'0x62E1960De1F9CA64d8fA578E871c2fe48b596b59',5,34,'BNB','0xf68062271b122b9351d381d58c195de43a9ed35a302f0045ed8826405cdd7a0c',1e17,97,'BNB','',0,0,'Pending'),(300,'0x90C17d5D39299419983A5f5332072442Fb6e04D6',242,4,'ETH','0x578f887283f9317528271c7ab708b383e7ac833d91bbbd81cd5c7d96dc06744f',1e17,34,'ETH','',0,0,'Pending'),(301,'0x90C17d5D39299419983A5f5332072442Fb6e04D6',242,4,'ETH','0x578f887283f9317528271c7ab708b383e7ac833d91bbbd81cd5c7d96dc06744f',1e17,34,'ETH','',0,0,'Pending'),(302,'0x1AaBD1FB4A9cF09D89F793128Ee6e0A88ADBBe89',243,4,'USDT','0x1f9e2946e4119b5054b39dab408dc144745a60288d1588819dffc0e49fbcbc7b',1e19,34,'DUSD','',0,0,'Pending'),(303,'0x1AaBD1FB4A9cF09D89F793128Ee6e0A88ADBBe89',244,4,'USDT','0x53b93052bed9d46397a5fda3431fc86eb27e9b254b3d60856529e2ad816c5b24',1e19,34,'DUSD','',0,0,'Pending'),(304,'0x1AaBD1FB4A9cF09D89F793128Ee6e0A88ADBBe89',245,4,'USDT','0x1a0143ce861217ca20ab5376279f9e459dbad1adda94c09654edcaaa2e0f293a',1e19,34,'DUSD','',0,0,'Pending'),(305,'0x1AaBD1FB4A9cF09D89F793128Ee6e0A88ADBBe89',246,4,'USDT','0xa8f0f61f2453f6b10862a2132b985953e406f205f22fdec350df20b2cd8f11de',1e19,34,'DUSD','',0,0,'Pending');
/*!40000 ALTER TABLE `bridge_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lastblock`
--

DROP TABLE IF EXISTS `lastblock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lastblock` (
  `id` int(11) NOT NULL DEFAULT '0',
  `bsc` int(11) NOT NULL,
  `dithereum` int(11) NOT NULL,
  `hecochain` int(11) NOT NULL,
  `polygon` int(11) NOT NULL,
  `ethereum` int(11) NOT NULL,
  `rinkeby` int(11) NOT NULL,
  `trx` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lastblock`
--

LOCK TABLES `lastblock` WRITE;
/*!40000 ALTER TABLE `lastblock` DISABLE KEYS */;
INSERT INTO `lastblock` VALUES (1,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `lastblock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'test'
--

--
-- Dumping routines for database 'test'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-03-22 17:02:01
