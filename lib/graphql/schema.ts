export const typeDefs = `#graphql
  scalar DateTime
  scalar JSON

  enum Status {
    DRAFT
    PUBLISHED
  }

  enum CampaignStatus {
    DRAFT
    SENDING
    SENT
    FAILED
  }

  enum RecipientStatus {
    PENDING
    SENT
    FAILED
  }

  type AdminUser {
    id: ID!
    email: String!
    name: String
  }

  type PageContent {
    id: ID!
    slug: String!
    title: String
    content: JSON!
    status: Status!
    publishedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type HouseType {
    id: ID!
    name: String!
    slug: String!
    description: String
    images: [String!]!
    priceFrom: Float!
    bedrooms: Int!
    bathrooms: Int!
    floorAreaSqm: Float!
    status: Status!
    publishedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type NewsPost {
    id: ID!
    title: String!
    slug: String!
    body: String!
    excerpt: String
    status: Status!
    publishedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Subscriber {
    id: ID!
    name: String!
    email: String!
    consent: Boolean!
    subscribedAt: DateTime!
  }

  type Campaign {
    id: ID!
    subject: String!
    body: String!
    newsPost: NewsPost
    status: CampaignStatus!
    sentAt: DateTime
    recipientCount: Int!
    recipients: [CampaignRecipient!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type CampaignRecipient {
    id: ID!
    subscriber: Subscriber!
    status: RecipientStatus!
    sentAt: DateTime
    error: String
  }

  input PageContentInput {
    slug: String!
    title: String
    content: JSON!
    status: Status
  }

  input HouseTypeInput {
    name: String!
    slug: String!
    description: String
    images: [String!]
    priceFrom: Float!
    bedrooms: Int!
    bathrooms: Int!
    floorAreaSqm: Float!
    status: Status
  }

  input NewsPostInput {
    title: String!
    slug: String!
    body: String!
    excerpt: String
    status: Status
  }

  input RegisterSubscriberInput {
    name: String!
    email: String!
    consent: Boolean!
  }

  input CampaignInput {
    subject: String!
    body: String!
    newsPostId: ID
  }

  type Query {
    me: AdminUser

    pageContents: [PageContent!]!
    pageContent(slug: String!): PageContent

    houseTypes: [HouseType!]!
    houseType(slug: String!): HouseType

    newsPosts: [NewsPost!]!
    newsPost(slug: String!): NewsPost

    campaigns: [Campaign!]!
    campaign(id: ID!): Campaign
    consentedSubscriberCount: Int!
    subscribers: [Subscriber!]!
  }

  type Mutation {
    createPageContent(input: PageContentInput!): PageContent!
    updatePageContent(id: ID!, input: PageContentInput!): PageContent!
    deletePageContent(id: ID!): Boolean!

    createHouseType(input: HouseTypeInput!): HouseType!
    updateHouseType(id: ID!, input: HouseTypeInput!): HouseType!
    deleteHouseType(id: ID!): Boolean!

    createNewsPost(input: NewsPostInput!): NewsPost!
    updateNewsPost(id: ID!, input: NewsPostInput!): NewsPost!
    deleteNewsPost(id: ID!): Boolean!

    registerSubscriber(input: RegisterSubscriberInput!): Subscriber!
    unsubscribe(token: String!): Boolean!

    createCampaign(input: CampaignInput!): Campaign!
    sendCampaign(id: ID!): Campaign!
  }
`;
