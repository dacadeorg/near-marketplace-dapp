use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap};
use near_sdk::{env, near_bindgen, require, AccountId, PanicOnDefault, Promise};
use near_sdk::serde::{Serialize, Deserialize};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Marketplace {
    
    /**
        `listed_products` - it's a key-value data structure that is used to store products by sellers.
        The backbone of this data structure is {@link UnorderedMap}.
        Brakedown of the `UnorderedMap<String, Product>` data structure:
          - the key of `UnorderedMap` is a `product_id`
          - the value in this `UnorderedMap` is a product itself `Product` that is related to a given key (`product_id`)
    */
    listed_products: UnorderedMap<String, Product>
}

#[near_bindgen]
impl Marketplace {
    
    #[init]
    pub fn init() -> Self {
        Self {
            listed_products: UnorderedMap::new(b"listed_products".to_vec()),
        }
    }

    /**
        payload - a payload struct that mapped to a Product and later stored in the blockchain
    */
    pub fn set_product(&mut self, payload: Payload) {
        require!(self.listed_products.get(&payload.id).is_none(), format!("a product with id={} already exists", payload.id));
        let product = Product::from_payload(payload);
        self.listed_products.insert(&product.id, &product);
    }

    /**
        A function that returns a single product for given owner and product id
        id - an identifier of a product to be returned
        a product for a given id
    */
    pub fn get_product(self, id: &String) -> Option<Product> {
        self.listed_products.get(id)
    }

    /**
        A function that returns an array of products for all accounts
        returns an array of objects that represent a product
    */
    pub fn get_products(self) -> Vec<Product> {
        self.listed_products.values_as_vector().to_vec()
    }

    /** 
        This function changes the state of data in the blockchain. 
        It is used to issue buy transactions when a product is purchased from a given seller (if the product is available) 
        product_id - an identifier of a product that is the subject of purchase
    */
    #[payable]
    pub fn buy_product(&mut self, product_id: &String) {
        match self.listed_products.get(product_id) {
            Some(ref mut product) => {
                let price = product.price.parse().unwrap();
                assert_eq! (env::attached_deposit(), price, "attached deposit should be equal to the price of the product");
                let owner = &product.owner.as_str();
                /*
                    `Promise` is used here to create a transaction to transfer the money to the seller
                    The amount of money to be used in the transaction is taken from `env::attached_deposit()` 
                    which is defined by `--depositYocto=${AMOUNT}` parameter during the invocation 
                */
                Promise::new(owner.parse().unwrap()).transfer(price);
                product.increment_sold_amount();
                self.listed_products.insert(&product.id, &product);
            },
            _ => {
                env::panic_str("product not found");
            }
        }
    }
}

/// This struct represents a payload that is used for data transit and mapped to Product later on.
#[near_bindgen]
#[derive(Serialize, Deserialize, PanicOnDefault)]
pub struct Payload {
    id: String,
    name: String,
    description: String,
    image: String,
    location: String,
    price: String
}

/** 
  This struct represents a product that can be listed on a marketplace.
  It contains basic properties that are needed to define a product.
  The price of the product is of type u128 that allows storing it in yocto-NEAR, where `1 yocto = 1^-24`.
  near_bindgen - it's a decorator that makes this class serializable so it can be persisted on the blockchain level. 
 */
#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize, Serialize, PanicOnDefault)]
pub struct Product {
    id: String,
    name: String,
    description: String,
    image: String,
    location: String,
    price: String,
    owner: AccountId,
    sold: u32
}

#[near_bindgen]
impl Product {

    pub fn from_payload(payload: Payload) -> Self {
        Self {
            id: payload.id,
            description: payload.description,
            name: payload.name,
            location: payload.location,
            price: payload.price,
            sold: 0,
            image: payload.image,
            owner: env::signer_account_id()
        }
    }

    pub fn increment_sold_amount(&mut self) {
        self.sold = self.sold + 1;
    }
}
