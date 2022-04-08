-- MySQL dump 10.13  Distrib 5.7.36, for Linux (x86_64)
--
-- Host: localhost    Database: DTH_ADMIN_DB
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
-- Table structure for table `binance_contract_orders`
--

DROP TABLE IF EXISTS `binance_contract_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `binance_contract_orders` (
  `chainid` bigint(20) DEFAULT NULL,
  `orderid` bigint(20) DEFAULT NULL,
  `transactionSent` tinyint(4) DEFAULT '0',
  `secretText` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `binance_contract_orders`
--

LOCK TABLES `binance_contract_orders` WRITE;
/*!40000 ALTER TABLE `binance_contract_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `binance_contract_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contract_orders`
--

DROP TABLE IF EXISTS `contract_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contract_orders` (
  `chainid` bigint(20) DEFAULT NULL,
  `orderid` bigint(20) DEFAULT NULL,
  `transactionSent` tinyint(4) DEFAULT '0',
  `secretText` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract_orders`
--

LOCK TABLES `contract_orders` WRITE;
/*!40000 ALTER TABLE `contract_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `contract_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dithereum_contract_orders`
--

DROP TABLE IF EXISTS `dithereum_contract_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dithereum_contract_orders` (
  `chainid` bigint(20) DEFAULT NULL,
  `orderid` bigint(20) DEFAULT NULL,
  `transactionSent` tinyint(4) DEFAULT '0',
  `secretText` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dithereum_contract_orders`
--

LOCK TABLES `dithereum_contract_orders` WRITE;
/*!40000 ALTER TABLE `dithereum_contract_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `dithereum_contract_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `heco_contract_orders`
--

DROP TABLE IF EXISTS `heco_contract_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `heco_contract_orders` (
  `chainid` bigint(20) DEFAULT NULL,
  `orderid` bigint(20) DEFAULT NULL,
  `transactionSent` tinyint(4) DEFAULT '0',
  `secretText` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `heco_contract_orders`
--

LOCK TABLES `heco_contract_orders` WRITE;
/*!40000 ALTER TABLE `heco_contract_orders` DISABLE KEYS */;
INSERT INTO `heco_contract_orders` VALUES (34,2,1,'0.43840700936440435'),(34,3,1,'0.8194662451777808');
/*!40000 ALTER TABLE `heco_contract_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nonce_admin_table`
--

DROP TABLE IF EXISTS `nonce_admin_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nonce_admin_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `walletid` varchar(100) NOT NULL,
  `walletpk` varchar(100) NOT NULL,
  `chainid` int(11) NOT NULL,
  `isFrozen` tinyint(1) NOT NULL,
  `secretphrase` varchar(300) DEFAULT NULL,
  `freezetime` int(11) DEFAULT '0',
  `nonce` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nonce_admin_table`
--

LOCK TABLES `nonce_admin_table` WRITE;
/*!40000 ALTER TABLE `nonce_admin_table` DISABLE KEYS */;
INSERT INTO `nonce_admin_table` VALUES (1,'0x9dD35f936298565Cc17c241fc645Eb4D1e04d895','2079696c01f5e53190aa1c72e57a72b93ca4ff165bf46d6ffef3129d108a879f',4,0,NULL,0,NULL),(2,'0x6077516eea959B7fb04bB211AD0569351f3eBDbc','8342678b959589fb5ad3cc593b410d892c8cb243363b2a30ee817070a89e8e8b',4,0,NULL,0,NULL),(3,'0x62E1960De1F9CA64d8fA578E871c2fe48b596b59','daedd37c356345aa579c5aff0a8d17e90fe9deec38054eb072fbbd10dd753942',4,0,NULL,0,NULL),(4,'0xF420Bc88E472191B936e7904b17DFD9E6043C12e','43f92fcfbecf0aa228b427f9f3958cf12a2ef9498310bbc26216445f54e7a47b',4,0,NULL,0,NULL),(5,'0xe72396544b18f229f7efE373c58B6948F75FaCD2','2905caabb2b6c6a057d40a0c7653d8b5c3f2189f8eb726d140b517a12a6f1d12',4,0,NULL,0,NULL),(11,'0x9dD35f936298565Cc17c241fc645Eb4D1e04d895','2079696c01f5e53190aa1c72e57a72b93ca4ff165bf46d6ffef3129d108a879f',24,0,NULL,0,NULL),(12,'0x6077516eea959B7fb04bB211AD0569351f3eBDbc','8342678b959589fb5ad3cc593b410d892c8cb243363b2a30ee817070a89e8e8b',24,0,NULL,0,NULL),(13,'0x62E1960De1F9CA64d8fA578E871c2fe48b596b59','daedd37c356345aa579c5aff0a8d17e90fe9deec38054eb072fbbd10dd753942',24,0,NULL,0,NULL),(14,'0xF420Bc88E472191B936e7904b17DFD9E6043C12e','43f92fcfbecf0aa228b427f9f3958cf12a2ef9498310bbc26216445f54e7a47b',24,0,NULL,0,NULL),(15,'0xe72396544b18f229f7efE373c58B6948F75FaCD2','2905caabb2b6c6a057d40a0c7653d8b5c3f2189f8eb726d140b517a12a6f1d12',24,0,NULL,0,NULL),(16,'0x9dD35f936298565Cc17c241fc645Eb4D1e04d895','2079696c01f5e53190aa1c72e57a72b93ca4ff165bf46d6ffef3129d108a879f',97,0,NULL,0,NULL),(17,'0x6077516eea959B7fb04bB211AD0569351f3eBDbc','8342678b959589fb5ad3cc593b410d892c8cb243363b2a30ee817070a89e8e8b',970,0,NULL,0,NULL),(18,'0x62E1960De1F9CA64d8fA578E871c2fe48b596b59','daedd37c356345aa579c5aff0a8d17e90fe9deec38054eb072fbbd10dd753942',970,0,NULL,0,NULL),(19,'0xF420Bc88E472191B936e7904b17DFD9E6043C12e','43f92fcfbecf0aa228b427f9f3958cf12a2ef9498310bbc26216445f54e7a47b',970,0,NULL,0,NULL),(20,'0xe72396544b18f229f7efE373c58B6948F75FaCD2','2905caabb2b6c6a057d40a0c7653d8b5c3f2189f8eb726d140b517a12a6f1d12',970,0,NULL,0,NULL),(27,'0x5B090d99717Ff10a523455062a9726B7C49cAe2c','1574f550fd80ff2214715ccc8a729ded4dd80dad2d48c831f820ee82e05c071f',256,0,NULL,0,NULL),(28,'0x9Bc088871972F6d7bd883dc32f21dD7E04A282Ce','e614297a29835e45d89a36960fe6d7f8b2a02c91a3f324f3eb9038c6d2699b20',256,0,NULL,0,NULL),(29,'0xb143740C642175E9EC24C451919dfb78f7cD692a','cf8b7a49918e0b084d64845ccfd4db2f7366674519f4cd606d9bc97f6c6a9d6d',80001,0,NULL,0,NULL),(30,'0x0f5167c2A6D575eFD3475783c285ACeFd4BdAD7C','8c43925b41c3aafcc306466fe1a6dc972cbeebe0951bb95c8076b2940e9a67df',80001,0,NULL,0,NULL),(31,'0x553D5CDe3cD4159cD5E497266d4e9d5A06dAb454','9ce636082ec4615e30141588575e1fc4949f172af42d6265a94e18dc4d587082',80001,0,NULL,0,NULL),(32,'0x0C94d6A85D5F922DF83CA326C284C50c5476C185','57d939aede512bd7475cf2b0a6c4b25755edd7ed51455c4bece648e6516e40b5',137,0,NULL,1649406480,NULL),(33,'0x0CdDE39d26D726a9D8590B280Cb6DC4bcac960e6','23883a8692e208fbed3656b97100259e3ba88ce364a7874d49d6e191e3dfc2ed',340,0,NULL,0,NULL),(34,'0x64493438D193E65fe793E1adACB4F6bb14308F85','f74c2b8dfb9f57781074e0bbd586cf9337ae3e3a94a333421fef7f2daa354a8d',340,0,NULL,0,NULL),(35,'0xcB8ea280B46F71Ae37f15D84209B60164175B03d','dcc6d05bf22c58f5ad7753a27f13ba79a0b94987ee64fe691cdc74bb41d32047',340,0,NULL,0,NULL),(36,'0x88A02F204D2acBE2bE3ccf4B4d96A48c195d6DF2','b7073ac4989603bc75fead7033a51181c4de56cefa640d98c070a162ea622361',340,0,NULL,0,NULL),(37,'0x81d8D3bC053d4fe0E73cCd7633baCc7B8fA9D856','f423461c3f9372d6bf65530cd85b5b812196905f74e0d246d5f9b60647215743',340,0,NULL,0,NULL),(38,'0x99AC32a479Dfd6989Bfc552e9F15d21235D24Eb1','89d84ff2153f4e1751af14495958f01fd68830aef016b46391fed156e0d1b016',340,0,NULL,0,NULL),(39,'0xB8e0F7dBf5ADB37fc5da55Cc7E9217F054c5D591','b9063b8d719a611fe3dc59fe0e690b6b7a8eff876b48f55bbbf630e873f3134f',340,0,NULL,0,NULL),(40,'0xd9ccb6117502bfB63044aa6c2539f88F64E84779','5dd554ca3c4d08f5b9c3d175ec146b5ecc0c2b7c3a1bbb5e8fab642515c29d5f',340,0,NULL,0,NULL),(41,'0xEc866E937258230b5731862A1efefdeCFf8c7a01','b39818a10a57a1974b84679d58c5a75b40e72f0366d4456e84684b1c73352c35',340,0,NULL,0,NULL),(42,'0x8e6BD4fB335D6f8FfDEA334368d260F4B6e74794','38e12172f563ad76e5b5402c39947ba1a04143c11795636b9f05878a95b43d38',340,0,NULL,0,NULL),(43,'0x8Af2630F218e8328EE716a635Df2E2a48c36204F','952f9eab1521ac8a9d92ca91bdd04a1a11e4d8f5e320ab25eb029cc1f12dda17',340,0,NULL,0,NULL),(44,'0xfbE32Fae9B854F2d9D2bdF0FA60386BAA9632730','73e18f70d9871fdca7dd28bbc96ed7a0cdc4e3f170119cf0b51e0f2879597fea',340,0,NULL,0,NULL),(45,'0x759D624420D5855b78A36B47d4775c3910c2D0a8','d349116fc889bfc07f4878d038b471bb6b3c4d194a0b13df569bebb066f4a585',340,0,NULL,0,NULL),(46,'0x40177E04DdFde34301222023371e95201aAE3038','abf0aeb999925a19220dc1bec7bb72e363f9ab35c44bbd1483c6ecf2b369b100',340,0,NULL,0,NULL),(47,'0x14695b9A56647B1fC8774A2Eb2dA7FD7B24F54eD','728b4a837fb34de179bca75754bd5ede1149aee219f9d19bd30028fb5490485e',340,0,NULL,0,NULL),(48,'0x61b1F91176c0a66744919667ba31639f9FBD4844','f36bc1442a3967a350e466d02df15a729b08c699a1eb438034eb596ba028a585',34,1,'LOCAL 34 ACCOUNT',1649399102,233),(49,'0x0FD2b66f4F8146b69933C9d208C7eA8EC6E82852','5e193f4e9a6933c23804083f6b82f7ef22bbe338514eda9f5aad24d884e3fdef',34,1,'LOCAL 34 ACCOUNT',1649399102,244),(50,'0x54A6d9561c028DA60eBFAb2371d926b4032F23f7','bbaa7a07e913b31fd7cae20e2f2e8d4e4ce5859c3eb0853a0392d235b22cd2a4',34,1,'LOCAL 34 ACCOUNT',1649399702,56),(51,'0x76Ca9dB2B76b883F252b834FE24a4594D33041fA','1fa07fdc6356c64991e49c8991dae56f5256bc562b3dabfaac048cafa0f6334e',97,0,'LOCAL 97 ACCOUNT',0,NULL),(52,'0x6C1AE4b37D418Af64F13f86168C9c69F718d1bB3','eef137efe9a19b454bc2156fd4fdd9ba50e56af5328e958cce4479d6304a4068',97,0,'LOCAL 97 ACCOUNT',0,NULL),(53,'0xFf809abB4103E59B47fd568348C529c2ed7a7Bf0','a2e2815671984cc1ba36ae12d50942e34da0a200eedd20b4074e9c7a96e41086',97,0,'LOCAL 97 ACCOUNT',0,NULL),(54,'0x5b05C7f51c9b67F59aD5219e6dC2b438065aF033','f9d705527f1977c95e4bc98ac9577da8dd87cac0a37624a059fcad30d873b251',137,0,NULL,1649406600,NULL),(55,'0xF7861385224a32DC7Cf1a94E3f7B61325b8F4dB5','6a5eb6701969039af83d2afa01efb05b7a6f7da0106eecede328d22b70619bed',137,0,NULL,1649406720,NULL),(56,'0x53C7344EE7F80DDEbF2BF6731400eBe8477B25eD','9a6432931041ff668c5fb50d33161e6e64e4ad579e001f5306cc2ea20bdeba0c',137,1,NULL,1649406840,NULL),(57,'0xa847821eA49DB8B696B167f73ADE865e5dB7603D','42001460723a5eb3fd4135b84e064ac4e19114fac3bd027f65dbd829444c8152',137,0,NULL,1649406362,NULL);
/*!40000 ALTER TABLE `nonce_admin_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `polygon_contract_orders`
--

DROP TABLE IF EXISTS `polygon_contract_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `polygon_contract_orders` (
  `chainid` bigint(20) DEFAULT NULL,
  `orderid` bigint(20) DEFAULT NULL,
  `transactionSent` tinyint(4) DEFAULT '0',
  `secretText` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `polygon_contract_orders`
--

LOCK TABLES `polygon_contract_orders` WRITE;
/*!40000 ALTER TABLE `polygon_contract_orders` DISABLE KEYS */;
INSERT INTO `polygon_contract_orders` VALUES (34,6,1,'0.1253392043615127'),(34,1,1,'0.45105710381025266');
/*!40000 ALTER TABLE `polygon_contract_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rinkeby_contract_orders`
--

DROP TABLE IF EXISTS `rinkeby_contract_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rinkeby_contract_orders` (
  `chainid` bigint(20) DEFAULT NULL,
  `orderid` bigint(20) DEFAULT NULL,
  `transactionSent` tinyint(4) DEFAULT '0',
  `secretText` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rinkeby_contract_orders`
--

LOCK TABLES `rinkeby_contract_orders` WRITE;
/*!40000 ALTER TABLE `rinkeby_contract_orders` DISABLE KEYS */;
INSERT INTO `rinkeby_contract_orders` VALUES (34,259,1,'0.7895095487665806'),(34,260,1,'0.7895095487665806'),(34,261,1,'0.7895095487665806'),(34,262,1,'0.7895095487665806'),(34,263,1,'0.7895095487665806'),(34,258,1,'0.1679321763817052');
/*!40000 ALTER TABLE `rinkeby_contract_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tron_contract_orders`
--

DROP TABLE IF EXISTS `tron_contract_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tron_contract_orders` (
  `chainid` bigint(20) DEFAULT NULL,
  `orderid` bigint(20) DEFAULT NULL,
  `transactionSent` tinyint(4) DEFAULT '0',
  `secretText` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tron_contract_orders`
--

LOCK TABLES `tron_contract_orders` WRITE;
/*!40000 ALTER TABLE `tron_contract_orders` DISABLE KEYS */;
INSERT INTO `tron_contract_orders` VALUES (34,16,1,'0.7610924051971253'),(34,15,1,'0.7610924051971253'),(34,13,1,'0.7610924051971253');
/*!40000 ALTER TABLE `tron_contract_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'DTH_ADMIN_DB'
--

--
-- Dumping routines for database 'DTH_ADMIN_DB'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-08 16:12:20
