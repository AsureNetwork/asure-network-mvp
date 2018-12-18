use parity_codec::Encode;
use srml_support::{StorageValue, dispatch::Result};
use runtime_primitives::traits::Hash;
use {balances, system::{self, ensure_signed}};



pub trait Trait: balances::Trait {}

decl_module! {
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		fn play(origin) -> Result {
			let sender = ensure_signed(origin)?;
			let payment = Self::payment().ok_or("Must have a payment amount set")?;

			<balances::Module<T>>::decrease_free_balance(&sender, payment)?;

			if (<system::Module<T>>::random_seed(), &sender)
				.using_encoded(<T as system::Trait>::Hashing::hash)
				.using_encoded(|e| e[0] < 128)
			{
				<balances::Module<T>>::increase_free_balance_creating(&sender, <Pot<T>>::take());
			}

			<Pot<T>>::mutate(|pot| *pot += payment);

			Ok(())
		}
		fn set_payment(_origin, value: T::Balance) -> Result {
			if Self::payment().is_none() {
				<Payment<T>>::put(value);
				<Pot<T>>::put(value);
			}
			Ok(())
		}
		fn send_sometext(_origin, value: T::Balance) -> Result {
		    <SomeText<T>>::put(value);
		    Ok(())
		}
	}
}

decl_storage! {
	trait Store for Module<T: Trait> as Demo {
		Payment get(payment) config(): Option<T::Balance>;
		Pot get(pot): T::Balance;
		SomeText get(sometext): T::Balance;
	}
}