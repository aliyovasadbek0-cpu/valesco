--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6 (Debian 17.6-1.pgdg13+1)
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    title jsonb NOT NULL,
    img character varying
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    packing jsonb DEFAULT '[]'::jsonb,
    specifications jsonb DEFAULT '[]'::jsonb,
    "categoryId" integer,
    description_ru character varying,
    description_en character varying,
    sae jsonb DEFAULT '[]'::jsonb,
    density jsonb DEFAULT '[]'::jsonb,
    kinematic_one jsonb DEFAULT '[]'::jsonb,
    kinematic_two jsonb DEFAULT '[]'::jsonb,
    flash jsonb DEFAULT '[]'::jsonb,
    temperature jsonb DEFAULT '[]'::jsonb,
    base jsonb DEFAULT '[]'::jsonb,
    title character varying NOT NULL,
    image jsonb DEFAULT '[]'::jsonb,
    viscosity jsonb DEFAULT '[]'::jsonb,
    info jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, title, img) FROM stdin;
10	{"en": "Motor oils for passenger cars and light commercial vehicles", "ru": "Моторные масла для легковой и легкой коммерческой техники"}	/uploads/categories/1756112342911-41794552.svg
11	{"en": "Motor oils for diesel engines", "ru": "Моторные масла для дизельных двигателей"}	/uploads/categories/1756112387810-120646428.svg
12	{"en": "Brake fluid", "ru": "Тормозная жидкость"}	/uploads/categories/1756112464172-31340851.svg
13	{"en": "Hydraulic oils", "ru": "Гидравлические масла"}	/uploads/categories/1756112531242-115797883.svg
14	{"en": "Filters", "ru": "Фильтры"}	/uploads/categories/1756112591735-32284751.svg
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, packing, specifications, "categoryId", description_ru, description_en, sae, density, kinematic_one, kinematic_two, flash, temperature, base, title, image, viscosity, info) FROM stdin;
15	[{"volume": "1L", "article": "132045"}, {"volume": "4L", "article": "162045"}]	["EUROTEC GX7000", "SAE 0W-20,", "API SN/CF"]	10			["0W-20", "САЕ J300"]	["0,845", "АСТМ Д 1298"]	["42,6", "АСТМ Д 445"]	["8,21", "АСТМ Д 445"]	["220", "АСТМ Д 92"]	["– 45", "АСТМ Д 97"]	["6,9", "АСТМ Д 2896"]	EUROTEC GX7000 0W-20 SN/CF	["https://valesco-production.up.railway.app/uploads/products/1756123418337-191883634.jpg"]	["171", "АСТМ Д 2270"]	[]
18	[{"volume": "1L", "article": "132045"}, {"volume": "4L", "article": "162045"}, {"volume": "20L", "article": "162045"}, {"volume": "60L", "article": "162045"}, {"volume": "200L", "article": "162045"}]	["API SN/CF ", "ACEA A3/B4", "ILSAC GF-5", "VW 502.00/505.00", "MB 226.5", "GM dexos 2"]	10	Высокопроизводительное, всесезонное, синтетическое моторное масло на основе технологии VHVI, включая\r\nаддитивный пакет ведущих мировых компаний (LUBRIZOL, INFINEUM, ENI).\r\nРекомендуемое применение во всех типах бензиновых и дизельных двигателей (с или без\r\nтурбозарядка) для легковых автомобилей, микроавтобусов, легковых автомобилей, а также газоэнергетических двигателей\r\n(СНГ). Он обладает стабильной вязкостью и длительным интервалом смены масла. Свойства экономии топлива от\r\nмногократно снижая потери на трение, обеспечивает отличные характеристики и максимальный двигатель\r\nмощности, благодаря технологии "ПОЛНОЕ ЭНЕРГЕТИЧЕСКОЕ РЕГУЛИРОВАНИЕ." Применить в соответствии с\r\nрекомендации производителя автомобильной техники. Осторожно! Воспламеняющаяся жидкость.\r\nИзбегайте контакта с кожей. Носите средства индивидуальной защиты. При контакте с кожей\r\nили глаз, немедленно промойте водой и обратитесь за медицинской помощью, если необходимо. Не\r\nсброс в канализационную систему, грунтовые и водные объекты. Утилизировать в специальных местах.\r\nДержите вне досягаемости детей. Избегайте хранения при температуре выше +60°C. Защитите fr	High-performance, all-season, synthetic engine oil based on VHVI technology, including\r\nadditive package by world leading companies (LUBRIZOL, INFINEUM, ENI).\r\nRecommended application in all types of petrol and diesel engines (with or without\r\nturbocharge) for passenger cars, minibuses, light trucks, as well as gas power engines\r\n(LPG). It has a stable viscosity and a long oil change interval. Fuel save properties by\r\nrepeatedly reducing friction loss, provides excellent performance and maximum engine\r\npower, due to the technology of "FULL ENERGY CONTROL". Apply in accordance with the\r\nrecommendations of the automotive equipment manufacturer. Caution! Flammable liquid.\r\nAvoid contact with skin. Wear personal protective equipment. In case of contact with skin\r\nor eyes, rinse immediately with water and seek medical attention if necessary. Do not\r\ndischarge into sewage system, ground and water bodies. Dispose of at special places.\r\nKeep out of reach of children. Avoid storage at temperatures above + 60°C. Protect from\r\ndirect sunlight. Expiry date is 5 years in the original factory packaging. Date of issue and\r\nbatch number are indicated on the package.\r\n	["5W-30", "SAE J 300"]	["0,850", "ASTM D 1298"]	["94", "АСТМ D 445"]	["12.154", "АСТМ Д 445"]	["230", "АСТМ Д 92"]	["– 42", "АСТМ Д 97"]	["8,75", "АСТМ Д 2896"]	EUROTEC GX7000 5W-30 SN/CF	["https://valesco-production.up.railway.app/uploads/products/1756185045553-504840968.jpg"]	["122", "АСТМ Д 2270"]	[]
19	[{"volume": "1L", "article": "132045"}, {"volume": "4L", "article": "162045"}, {"volume": "20L", "article": "162045"}, {"volume": "60L", "article": "162045"}, {"volume": "200L", "article": "162045"}]	["API SN/CF ", "ACEA A3/B4", "ILSAC GF-5", "VW 502.00/505.00", "MB 226.5", "GM dexos 2"]	10	Высокопроизводительное, всесезонное, синтетическое моторное масло на основе технологии VHVI, включая\r\nаддитивный пакет ведущих мировых компаний (LUBRIZOL, INFINEUM, ENI).\r\nРекомендуемое применение во всех типах бензиновых и дизельных двигателей (с или без\r\nтурбозарядка) для легковых автомобилей, микроавтобусов, легковых автомобилей, а также газоэнергетических двигателей\r\n(СНГ). Он обладает стабильной вязкостью и длительным интервалом смены масла. Свойства экономии топлива от\r\nмногократно снижая потери на трение, обеспечивает отличные характеристики и максимальный двигатель\r\nмощности, благодаря технологии "ПОЛНОЕ ЭНЕРГЕТИЧЕСКОЕ РЕГУЛИРОВАНИЕ." Применить в соответствии с\r\nрекомендации производителя автомобильной техники. Осторожно! Воспламеняющаяся жидкость.\r\nИзбегайте контакта с кожей. Носите средства индивидуальной защиты. При контакте с кожей\r\nили глаз, немедленно промойте водой и обратитесь за медицинской помощью, если необходимо. Не\r\nсброс в канализационную систему, грунтовые и водные объекты. Утилизировать в специальных местах.\r\nДержите вне досягаемости детей. Избегайте хранения при температуре выше +60°C. Защитите fr	High-performance, all-season, synthetic engine oil based on VHVI technology, including\r\nadditive package by world leading companies (LUBRIZOL, INFINEUM, ENI).\r\nRecommended application in all types of petrol and diesel engines (with or without\r\nturbocharge) for passenger cars, minibuses, light trucks, as well as gas power engines\r\n(LPG). It has a stable viscosity and a long oil change interval. Fuel save properties by\r\nrepeatedly reducing friction loss, provides excellent performance and maximum engine\r\npower, due to the technology of "FULL ENERGY CONTROL". Apply in accordance with the\r\nrecommendations of the automotive equipment manufacturer. Caution! Flammable liquid.\r\nAvoid contact with skin. Wear personal protective equipment. In case of contact with skin\r\nor eyes, rinse immediately with water and seek medical attention if necessary. Do not\r\ndischarge into sewage system, ground and water bodies. Dispose of at special places.\r\nKeep out of reach of children. Avoid storage at temperatures above + 60°C. Protect fr\r\n	["5W-40", "SAE J 300"]	["0,855", "ASTM D 1298"]	["125", "АСТМ D 445"]	["15.5", "АСТМ D 445"]	["230", "АСТМ D 92"]	["– 41", "АСТМ D 97"]	["8,85", "АСТМ D 2896"]	EUROTEC GX7000 5W-40 SN/CF	["https://valesco-production.up.railway.app/uploads/products/1756185825167-387369634.jpg"]	["132", "АСТМ D 2270"]	[]
28	[{"volume": "1L", "article": "132045"}, {"volume": "4L", "article": "162045"}, {"volume": "20L", "article": "162045"}, {"volume": "60L", "article": "162045"}, {"volume": "200L", "article": "162045"}]	["ACEA A3/B4", "API SN/CF", "VW 502 00/505 00"]	10	Полностью синтетическое моторное масло с повышенной топливной экономичностью...	Fully synthetic motor oil with improved fuel efficiency...	["0W-20", "SAE J300"]	["0.845", "ASTM D 1298"]	["189", "ASTM D 445"]	["19.17", "ASTM D 445"]	["236", "ASTM D 92"]	["-30", "ASTM D 97"]	["5.85", "ASTM D 2896"]	ZIC TOP ES 0W-20	["https://valesco-production.up.railway.app/uploads/products/1756205644502-164900102.jpg"]	["115", "ASTM D 2270"]	["Recommended for turbo engines", "Protects against wear", "Extended drain intervals"]
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 19, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 28, true);


--
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: products FK_ff56834e735fa78a15d0cf21926; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

