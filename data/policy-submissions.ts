export type PolicyPageImage = { file: string; w: number; h: number }

export type PolicyDocument = {
  label: string
  pdfUrl: string
  pages: PolicyPageImage[]
  paragraphs: string[]
}

export type PolicySubmission = {
  slug: string
  title: string
  subtitle: string
  presentedBy: string
  date: string
  isoDate: string
  resolution: string
  ohchrPdfUrl: string
  ohchrDirectoryUrl: string
  summary: string
  documents: PolicyDocument[]
}

export const POLICY_SUBMISSIONS: PolicySubmission[] = [
  {
    slug: "impact-of-mental-health-challenges-on-human-rights-of-young-people",
    title:
      "Study on the Impact of Mental Health Challenges on the Enjoyment of Human Rights by Young People",
    subtitle: "Human Rights Council Resolution 57/30",
    presentedBy: "Dr. Interested",
    date: "February 15, 2026",
    isoDate: "2026-02-15",
    resolution: "Human Rights Council Resolution 57/30",
    ohchrPdfUrl:
      "https://www.ohchr.org/sites/default/files/documents/cfi-subm/2026/378-impact-mental-health/subm-impact-mental-health-cso-148-dr-interested.pdf",
    ohchrDirectoryUrl:
      "https://www.ohchr.org/en/calls-for-input/2026/call-inputs-impact-mental-health-challenges-enjoyment-human-rights-young",
    summary:
      "Dr. Interested's submission to the UN Office of the High Commissioner for Human Rights (OHCHR), presented to the Human Rights Council under Resolution 57/30. Drawing on original survey data and a literature review, it examines how mental health challenges intersect with the enjoyment of human rights by young people, and sets out recommendations for governments and international cooperation.",
    documents: [
      {
        label: "Written Work",
        pdfUrl: "/policy/dr-interested-written-work-impact-mental-health-2026.pdf",
        pages: [
          { file: "/policy/pages/written-work-page-01.jpg", w: 1347, h: 1743 },
          { file: "/policy/pages/written-work-page-02.jpg", w: 1347, h: 1743 },
          { file: "/policy/pages/written-work-page-03.jpg", w: 1347, h: 1743 },
          { file: "/policy/pages/written-work-page-04.jpg", w: 1347, h: 1743 },
          { file: "/policy/pages/written-work-page-05.jpg", w: 1347, h: 1743 },
        ],
        paragraphs: [
          "Study on the impact of mental health challenges on the enjoyment of human rights by young people - Human Rights Council Resolution 57/30 Presented to the Council by Dr. Interested - Dated: February 15, 2026 Note: Dr. Interested is an international organization. As a result, this report may at times focus on multiple countries. A literature review is used to provide context. However, the most important finding of this report comes from survey results on the relationship between human rights and mental health.",
          "What are the main mental health challenges faced by young people in your country, and what is the impact on their human rights? Results of the survey:",
          "Based on an analysis of the survey responses, a meaningful relationship appears to exist between reported mental health challenges and experiences of discrimination among youth participants. Symptoms associated with general anxiety, including excessive worry about the future, fear of making mistakes, and being overly anxious to please others, were among the most frequently elevated categories. Respondents with higher anxiety scores were also more likely to report experiencing discrimination within the past five years. Similarly, youth reporting mood-related concerns such as persistent sadness, hopelessness, and loss of interest in usual activities showed overlap with experiences of unfair treatment. Although ADHD and attentional difficulties were not isolated as a single labelled variable, indicators of behavioural and emotional regulation challenges suggest that neurodivergent traits may intersect with discrimination, particularly in school or authority-based contexts.",
          "When examining the specific reasons for discrimination, identity-based factors such as race/ethnicity, sex/gender, religion, and disability status were among the most commonly selected categories. Notably, youth who reported mental health difficulties appeared more likely to cite discrimination based on disability or mental health status, suggesting that stigma surrounding psychological conditions remains a significant concern. Additionally, racial and religious discrimination showed overlap with elevated anxiety and mood symptoms, indicating that identity-based discrimination may contribute to or exacerbate internal emotional distress.",
          "Overall, the findings suggest that certain mental health concerns, especially generalized anxiety and depressive symptoms, are associated with higher reported experiences of discrimination, highlighting the intersection between youth mental health and human rights protections. While the data does not establish causation, it strongly indicates that discrimination and mental health challenges coexist in ways that warrant further policy attention and protective intervention.",
          "What steps is the Government taking to address the root causes of the mental health challenges that young people face and ensure that young people's human rights are respected, protected and fulfilled in this context?",
          "The Canadian Government predominantly takes a reactive approach to mental health, as seen from the initiatives that focus on expanding mental health services, crisis lines, research funding, and awareness campaigns. However, these measures fail to address the root causes of mental health challenges, which run deeper than the consequences of mental health decline and their current immediate needs.",
          "Contributing factors to youth mental health challenges range from the lingering effects of the Covid-19 pandemic, social media, systemic inequality, social stigma, marginalization, academic pressure, and traumatic experiences, among others (James 2017).",
          "Marginalized young people tend not to fit into prevailing social norms or “acceptable” archetypes, and therefore are excluded, disadvantaged, or even discriminated against. As a result, these individuals frequently encounter reduced opportunities, increased vulnerability, and systemic inequality. Marginalized youth may include, but are not limited to, members of the LGBTQ+ community, racial or ethnic minorities (such as Black or Indigenous individuals), those from low socioeconomic backgrounds, and individuals with physical or mental disabilities. Young people in vulnerable situations are frequently marginalized as well. However, some face additional challenges, such as inadequate governmental or familial support, instability, trauma, or abuse, which threaten to throw them into the deep end of the pool of mental health challenges (Robson 2015).",
          "However, current efforts to view structural policies as mental health policies, such as the Housing and Mental Health Policy Framework, must be acknowledged. This framework aims to provide a model for policies that address the needs of individuals with mental illness, including those with substance use disorders. While its guiding principles recognize housing as a key determinant of health and a core component of recovery, the framework primarily focuses on crisis support rather than proactive prevention. The current approach focuses on supporting individuals with serious mental health issues, which is great, but does not resolve the underlying housing concerns that contribute to mental health challenges that marginalized youth face, such as high housing costs, individual safety in a household, unsafe living conditions, infrastructure safety, and lack of exposure to diverse and inclusive communities. Although the framework ensures access to quality, affordable, and supportive housing for individuals with serious mental illness, a more proactive stance is needed, and there should be emphasis on inclusive societies, housing-based mental health initiatives, addressing structural barriers to housing access in the first place and implementing measures to prevent housing insecurity among at-risk populations. Youth with multiple marginalized identities, including Indigenous, Black, racialized, and 2SLGBTQ+ people, encounter additional barriers to housing and support, such as systemic racism, discrimination, and violence. Youth with serious mental illness may also become stuck in the supportive housing system and experience poor living conditions (Daley et al. 2023). Poor housing exacerbates structural inequalities (such as those of income, gender, race, and ethnicity), whereas access to good housing is crucial to building inclusive communities, as youth are more likely to engage with and contribute to them. While the current approach's effort to recognize the mental health aspect associated with housing and attempting to break the cycle of mental health decline is highly commendable, further efforts are required to address the underlying factors (Kingsbury & Findlay, 2024).",
          "What proportion of public expenditure is allocated to health, specifically to youth mental health services, and have there been changes?",
          "When looking at Canadian Provinces, health represents a small portion of public funding; yet, mental health funding, particularly youth mental health, receives a disproportionately small share of that funding. While exact data in percentages for youth mental health are not consistently reported, multiple sources confirm that the investment levels do not reflect the severity of youth mental health needs. (Vaghri et al., 2023).",
          "The Mental Health of Children: The Dire Global Picture of a Core Human Right report shows that youth are the most likely age group to experience mental health or a mental health crisis, yet provincial health care systems still lack funding and resources, with staffing shortages across the board, long waitlists for treatments or appointments and limited publicly funded services. Suicide is the second leading cause of death among youth in Canada. This highlights the urgency of needed provincial investment in youth mental health. (Kingsbury & Findlay, 2024).",
          "It is reported that Provincial governments implemented temporary funding increases during COVID-19, yet these investments were short-term and insufficient in demand. Examples of this are: Québec invested $35 million in 2017 to launch a public psychotherapy program and later added $31.1 million in 2020 to expand mental health services. Ontario committed $72.6 million over three years for structured psychotherapy programs and an additional $20 million in 2020 to increase access. Although provincial health spending is substantial, specifically mental health and sub-specifically youth mental health, it remains structurally and systematically underfunded. Temporary pandemic-related increases did not translate to sustained system-wide investment. (Vaghri et al. 2023)",
          "How can provinces deliver more effectively to ensure the realization of young people's right to mental health, and what are promising practices?",
          "1. Strengthen legislative and policy frameworks. Provinces should work to make youth mental health a protected right within health legislation and adopt in-depth child and youth mental health strategies. (Vaghri et al., 2023).",
          "2. Expanding access to publicly funded services. Provinces should: a. Fund public psychotherapy programs accessible without out-of-pocket costs for patients. b. Expand school-based mental health services and community mental health clinics, for example by hiring more Child and Youth Workers (CYWs), Mental Health Workers (MHWs), Social Workers, and in-school Psychiatrists.",
          "3. Invest in early intervention and prevention. Early detection and intervention are critical due to rapid brain development in childhood and adolescence. Timely intervention reduces long-term disability and service costs. (Vaghri et al. 2023).",
          "4. Addressing social determinants. Mental health outcomes are strongly influenced by poverty, housing and food insecurity, discrimination, trauma and social exclusion. Provincial policies should not only address youth mental health but also address determinants that can affect mental health, providing a proactive approach.",
          "Disaggregated & Statistical Evidence",
          "Globally, approximately 13% of children and adolescents experience a mental health disorder (Polanczyk et al. 2015, cited in Vaghri et al. 2023). In Canada, youth are the most likely age group to experience mental illness (Pearson et al. 2013, cited in Vaghri et al. 2023). Suicide is the second leading cause of death among Canadian youth (Vaghri et al. 2023).",
          "Mental health risks are significantly higher among: Indigenous youth, who have suicide rates five to eleven times higher than non-Indigenous youth (Vaghri et al., 2023); youth living in poverty; racialized, migrant, and refugee youth; LGBTQ+ youth; and youth with disabilities (Vaghri et al. 2023).",
          "What laws, policies, and programmes exist in your country concerning the mental health of young people?",
          "National Strategies and Youth-Focused Programs. The United States also has national strategies that focus on providing mental health services for youths. The National Strategy for Suicide Prevention, for example, targets providing early intervention, crisis lines, and education in schools. An important component of this national strategy is the 988 Suicide & Crisis Lifeline, which offers free, confidential, 24/7 mental health services, including services for teens (National Strategy for Suicide Prevention).",
          "Another significant move is that of SAMHSA (Substance Abuse and Mental Health Services Administration)'s youth mental health initiatives, which provide grants for community clinics, school-based mental health services, and peer support services. Some of these initiatives have been made possible through involvement and input from young people, particularly through youth advisory councils, making them more acceptable and accessible to young people. Yet, many young people still have to wait a long time, face stigma, or have no services available in their rural and poor communities (SAMHSA Announces $231M Funding Opportunity).",
          "The United States has made significant steps and progress in protecting young people's right to mental health care through laws and school and national initiatives. However, there are still challenges and barriers that have to be overcome to make mental health care equally accessible and acceptable to young people (Mental Health Parity and Addiction Equity Act; Every Student Succeeds Act; Individuals with Disabilities Education Act; National Strategy for Suicide Prevention; SAMHSA Announces $231M Funding Opportunity) (Jaffee et al, 2024).",
          "How can States deliver more effectively to ensure the full and effective realization of young people's human right to mental health, including through international cooperation?",
          "The States can effectively ensure the realization of young people's right to mental health by treating mental health conditions using a human rights-based approach, wherein young people can receive effective treatment for their mental health conditions, without being stigmatized. When treating young people with mental health issues, psychiatrists tend to focus more on biomedical intervention by prescribing tablets and pharmaceutical drugs, and less on social determinants of their condition (Cosgrove et al, 2020).",
          "The rise of commercialized science in the United States, which used to cater to commercial needs, has influenced the way mental health issues are treated. Psychiatrists in the United States primarily use biomedical intervention on patients with mental issues, instead of also keeping the social determinants in mind, because they gain commercial support by selling those medicines. As a result, mental health is viewed as an economic good, even though the legislation explicitly states it as a human right. Moreover, people with mental issues are often stigmatized, and that stigma of their issues prevents them from receiving treatment. For instance, in 2022, among the 59.3 million adults with mental issues, only 30.0 million (50.6%) received mental health treatment in the past year (Patel et al. 2007). White individuals and those who identify with two or more races have a higher percentage of mental illnesses, compared to other groups.",
          "These issues can be resolved by understanding the relationship between human rights and the social determinants of health, and developing a human rights approach to address issues in that relationship. International cooperation would also help deliver an effective realization of young people's human right to mental health, because it would reduce stigma on people with mental health issues by amplifying the voices of advocacy groups and individuals who have gone through those issues, so that young people could get awareness, as most mental disorders begin during ages 18 to 24, but they are often detected later in life (Patel et al. 2007). The States should use a human rights based approach, and adopt active policy actions to give a holistic expression to the right to health outside hospitals and other healthcare facilities, since all relationships in society are shaped by wider social, economic, political, and cultural forces that the States are required to ensure are consistent with the health obligations under international law (Cosgrove et al. 2020).",
          "Respectfully submitted on behalf of Dr. Interested by the undersigned authors.",
          "Signed, Velan Mangai Sivakumar (Deputy Executive Director), Adil Mukhi (Executive Director), Muhammad Lari (Director of Publication).",
          "Contributing Authors: Grasen Tyler Carlton Menns, Asiya Farooq, Shivani Ramesh Kanna, Fleur Larse, Ishanshi Vegad — on behalf of the Dr. Interested Team.",
        ],
      },
      {
        label: "Relevant Statistical Data & Bibliography",
        pdfUrl: "/policy/dr-interested-statistical-data-bibliography-2026.pdf",
        pages: [
          { file: "/policy/pages/statistical-data-page-01.jpg", w: 1347, h: 1743 },
          { file: "/policy/pages/statistical-data-page-02.jpg", w: 1347, h: 1743 },
          { file: "/policy/pages/statistical-data-page-03.jpg", w: 1347, h: 1743 },
          { file: "/policy/pages/statistical-data-page-04.jpg", w: 1347, h: 1743 },
          { file: "/policy/pages/statistical-data-page-05.jpg", w: 1347, h: 1743 },
        ],
        paragraphs: [
          "Bibliography",
          "Cosgrove, Lisa, et al. “Why Psychiatry Needs an Honest Dose of Gentle Medicine.” Frontiers in Psychiatry, vol. 14, 21 Apr. 2023, https://doi.org/10.3389/fpsyt.2023.1167910.",
          "Cosgrove, Lisa, and Allen F Shaughnessy. “Mental Health as a Basic Human Right and the Interference of Commercialized Science.” Health and Human Rights, vol. 22, no. 1, June 2020, p. 61, pmc.ncbi.nlm.nih.gov/articles/PMC7348431/.",
          "Daley, Andrea, et al. “‘This Is the System We Live In’: The Role of Social Assistance in Producing and Sustaining 2SLGBTQ+ Poverty in Ontario, Canada.” Sexuality Research and Social Policy, 22 Aug. 2023, https://doi.org/10.1007/s13178-023-00852-w.",
          "Hannah, Julie, and Tasneem Sadiq. “Relationships Are Human Rights Determinants in Mental Health.” HHR Journal, 2019, www.hhrjournal.org/2019/06/24/relationships-are-human-rights-determinants-in-mental-health/. Accessed 15 Feb. 2026.",
          "Jaffee, Sara R., et al. “Annual Research Review: Cash Transfer Programs and Young People’s Mental Health – a Review of Studies in the United States.” Journal of Child Psychology and Psychiatry, 21 Dec. 2024, https://doi.org/10.1111/jcpp.14101.",
          "James, Carl E. “The Schooling of Marginalized Students in Urban Canada: Programs, Curricula, and Pedagogies.” Palgrave Macmillan US eBooks, 1 Jan. 2017, pp. 35–57, https://doi.org/10.1057/978-1-137-52526-0_3.",
          "Kingsbury, Mila, and Leanne Findlay. “Mental Health and Access to Support among 2SLGBTQ+ Youth.” PubMed, vol. 35, no. 11, 20 Nov. 2024, pp. 12–22, www150.statcan.gc.ca/n1/pub/82-003-x/2024011/article/00002-eng.htm, https://doi.org/10.25318/82-003-x202401100002-eng.",
          "National Institute of Mental Health. “Mental Illness.” National Institute of Mental Health, Sept. 2024, www.nimh.nih.gov/health/statistics/mental-illness.",
          "Patel, Vikram, et al. “Mental Health of Young People: A Global Public-Health Challenge.” The Lancet, vol. 369, no. 9569, Apr. 2007, pp. 1302–1313, https://doi.org/10.1016/S0140-6736(07)60368-7.",
          "Polanczyk, Guilherme V., et al. “Annual Research Review: A Meta-Analysis of the Worldwide Prevalence of Mental Disorders in Children and Adolescents.” Journal of Child Psychology and Psychiatry, vol. 56, no. 3, 3 Feb. 2015, pp. 345–365, pubmed.ncbi.nlm.nih.gov/25649325/, https://doi.org/10.1111/jcpp.12381.",
          "Robson, Karen, et al. Identifying the Complexity of Barriers Faced by Marginalized Youth in Transition to Postsecondary Education in Ontario. 2015.",
          "Vaghri, Ziba. Children's Rights-Based Indicators. Edited by Roberta Ruggiero and Gerison Lansdown, Children's Well-Being: Indicators and Research, Cham, Springer Nature Switzerland, 2025. Accessed 15 Feb. 2026.",
          "Appendix A: Survey Raw Results — see the full statistical data & bibliography document above for the complete survey dataset referenced in this submission.",
        ],
      },
    ],
  },
]

export function getPolicySubmissionBySlug(slug: string) {
  return POLICY_SUBMISSIONS.find((p) => p.slug === slug)
}
