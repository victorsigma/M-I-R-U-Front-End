import { FormGroup, ValidationErrors } from '@angular/forms';

const allUndefined = (field1: string, field2: string, field3: string) => {
    return (formGroup: FormGroup): ValidationErrors | null => {
        const control1: any = formGroup.get(field1)?.value;
        const control2: any = formGroup.get(field2)?.value;
        const control3: any = formGroup.get(field3)?.value;

        if (control1 == false && control2 == false && control3 == false) {
            return { allUndefined: true };
        } else {
            return null;
        }
    };
}


export default allUndefined